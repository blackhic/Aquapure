import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/app/lib/supabase";
import { embed, toVectorLiteral } from "@/app/lib/embeddings";
import { buildSystemPrompt } from "@/app/lib/chatPrompt";

// Route publique (pas de cookie admin) — appelle Anthropic + OpenAI (embeddings)
// + Supabase service_role, tous serveur only. Ne jamais exposer les clés.
export const runtime = "nodejs";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-haiku-4-5";
const MAX_TOKENS = 1024;

// ── Garde-fous anti-abus ─────────────────────────────────────────────────────
const MAX_MESSAGE_LEN = 1000; // longueur max du dernier message
const MAX_HISTORY = 8; // nb max de messages envoyés à l'API
const MATCH_COUNT = 5; // top-k chunks
const SIMILARITY_THRESHOLD = 0.2; // en-dessous → chunk ignoré

// Rate-limit EN MÉMOIRE, best-effort. ⚠️ Sur serverless (Vercel), la mémoire
// n'est PAS partagée entre instances/lambdas : un attaquant réparti peut le
// contourner. Suffisant pour un frein anti-abus v1 ; pour du durable il faudra
// un store partagé (Supabase, Upstash…).
const RATE_LIMIT = 15; // messages / fenêtre / IP
const WINDOW_MS = 60_000;
const ipHits = new Map<string, number[]>();

function rateLimited(ip: string, now: number): boolean {
  const recent = (ipHits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  ipHits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

type ChatMessage = { role: "user" | "assistant"; content: string };

function parseMessages(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input)) return null;
  const out: ChatMessage[] = [];
  for (const m of input) {
    if (!m || typeof m !== "object") return null;
    const role = (m as { role?: unknown }).role;
    const content = (m as { content?: unknown }).content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") {
      return null;
    }
    out.push({ role, content });
  }
  return out;
}

export async function POST(request: NextRequest) {
  const now = Date.now();

  // 1. Rate-limit par IP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip, now)) {
    return NextResponse.json(
      { error: "Trop de messages. Réessayez dans une minute." },
      { status: 429 },
    );
  }

  // 2. Parse + validation
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const messages = parseMessages((body as { messages?: unknown })?.messages);
  if (!messages || messages.length === 0) {
    return NextResponse.json({ error: "Aucun message." }, { status: 400 });
  }

  // On borne l'historique et on s'assure que ça commence par un message user
  // (exigence de l'API Anthropic).
  let history = messages.slice(-MAX_HISTORY);
  while (history.length > 0 && history[0].role !== "user") history = history.slice(1);
  if (history.length === 0) {
    return NextResponse.json({ error: "Aucun message." }, { status: 400 });
  }

  const lastUser = [...history].reverse().find((m) => m.role === "user");
  if (!lastUser || !lastUser.content.trim()) {
    return NextResponse.json({ error: "Message vide." }, { status: 400 });
  }
  if (lastUser.content.length > MAX_MESSAGE_LEN) {
    return NextResponse.json(
      { error: `Message trop long (max ${MAX_MESSAGE_LEN} caractères).` },
      { status: 400 },
    );
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    console.error("[api/chat] ANTHROPIC_API_KEY manquante.");
    return NextResponse.json(
      { error: "Assistant indisponible pour le moment." },
      { status: 503 },
    );
  }

  // 3. RAG : embed la question → chunks pertinents (au-dessus du seuil).
  //    En cas d'échec (embeddings/DB), on continue avec un contexte vide :
  //    le system prompt applique alors la règle 2 (rediriger vers Mehdi).
  let chunks: string[] = [];
  try {
    const queryEmbedding = await embed(lastUser.content.trim());
    const { data, error } = await getSupabaseAdmin().rpc("match_knowledge_chunks", {
      query_embedding: toVectorLiteral(queryEmbedding),
      match_count: MATCH_COUNT,
    });
    if (error) {
      console.error("[api/chat] Erreur RPC match_knowledge_chunks :", error.message);
    } else if (Array.isArray(data)) {
      chunks = data
        .filter((r: { similarity?: number }) => (r.similarity ?? 0) >= SIMILARITY_THRESHOLD)
        .map((r: { chunk_text: string }) => r.chunk_text);
    }
  } catch (err) {
    console.error("[api/chat] Échec récupération contexte :", err);
  }

  const system = buildSystemPrompt(chunks);

  // 4. Appel Anthropic en streaming
  let anthropicRes: Response;
  try {
    anthropicRes = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system,
        messages: history,
        stream: true,
      }),
    });
  } catch (err) {
    console.error("[api/chat] Échec réseau Anthropic :", err);
    return NextResponse.json(
      { error: "Assistant indisponible. Réessayez ou appelez le 04 84 35 04 86." },
      { status: 502 },
    );
  }

  if (!anthropicRes.ok || !anthropicRes.body) {
    const detail = await anthropicRes.text().catch(() => "");
    console.error(`[api/chat] Erreur Anthropic (HTTP ${anthropicRes.status}) : ${detail}`);
    return NextResponse.json(
      { error: "Assistant indisponible. Réessayez ou appelez le 04 84 35 04 86." },
      { status: 502 },
    );
  }

  // 5. Relais du flux SSE Anthropic → flux de texte brut (tokens) au client.
  //    On n'extrait que les deltas de texte ; les clés restent côté serveur.
  const upstream = anthropicRes.body;
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.getReader();
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();
      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const payload = trimmed.slice(5).trim();
            if (!payload || payload === "[DONE]") continue;
            try {
              const evt = JSON.parse(payload);
              if (evt.type === "content_block_delta" && evt.delta?.type === "text_delta") {
                controller.enqueue(encoder.encode(evt.delta.text));
              }
            } catch {
              /* ligne SSE non-JSON : ignorée */
            }
          }
        }
      } catch (err) {
        console.error("[api/chat] Erreur pendant le stream :", err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
