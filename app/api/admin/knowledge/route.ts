import { NextResponse, type NextRequest } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/app/lib/supabase";
import { ADMIN_COOKIE, verifySessionToken } from "@/app/lib/adminAuth";
import { chunkEntry, embedBatch, toVectorLiteral } from "@/app/lib/embeddings";

export const runtime = "nodejs";

const TYPES = new Set(["document", "qa"]);

type KnowledgeRow = {
  type: string;
  title: string | null;
  question: string | null;
  content: string;
};

// Chunk + embed une entrée, puis insère les chunks liés (source_id). L'appel
// OpenAI (embedBatch) est fait AVANT toute écriture par l'appelant : ici on ne
// fait plus que des écritures locales. Lève en cas d'échec d'insertion.
async function insertChunks(
  supabase: SupabaseClient,
  sourceId: string,
  chunkTexts: string[],
  embeddings: number[][],
): Promise<void> {
  const rows = chunkTexts.map((text, i) => ({
    source_id: sourceId,
    chunk_text: text,
    embedding: toVectorLiteral(embeddings[i]),
  }));
  const { error } = await supabase.from("knowledge_chunks").insert(rows);
  if (error) throw new Error(error.message);
}

// Garde d'authentification explicite (le middleware ne couvre que les *pages*
// /admin/*, pas /api). Renvoie une NextResponse 401 si non autorisé, sinon null.
async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const authorized = secret ? await verifySessionToken(token, secret) : false;
  if (!authorized) {
    return NextResponse.json(
      { success: false, error: "Non autorisé." },
      { status: 401 },
    );
  }
  return null;
}

const isNonEmptyString = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;

type KnowledgePayload = {
  id?: unknown;
  type?: unknown;
  title?: unknown;
  question?: unknown;
  content?: unknown;
};

// Valide et normalise les champs d'une entrée. Renvoie soit une erreur, soit la
// ligne prête à insérer/mettre à jour (title/question à null si non pertinents).
function buildRow(
  body: KnowledgePayload,
):
  | { error: string }
  | { row: { type: string; title: string | null; question: string | null; content: string } } {
  const type = typeof body.type === "string" ? body.type : "";
  if (!TYPES.has(type)) {
    return { error: "Type invalide (document ou qa attendu)." };
  }
  if (!isNonEmptyString(body.content)) {
    return { error: "Le contenu est obligatoire." };
  }
  if (type === "qa" && !isNonEmptyString(body.question)) {
    return { error: "La question est obligatoire pour une Q/R." };
  }

  const title = isNonEmptyString(body.title) ? body.title.trim() : null;

  return {
    row: {
      type,
      // Un document n'a pas de question ; une Q/R conserve sa question.
      question:
        type === "qa" && isNonEmptyString(body.question)
          ? body.question.trim()
          : null,
      title,
      content: (body.content as string).trim(),
    },
  };
}

async function parseBody(request: NextRequest): Promise<KnowledgePayload | null> {
  try {
    return (await request.json()) as KnowledgePayload;
  } catch {
    return null;
  }
}

// ── POST : créer une entrée ──────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const unauth = await requireAdmin(request);
  if (unauth) return unauth;

  const body = await parseBody(request);
  if (!body) {
    return NextResponse.json({ success: false, error: "Requête invalide." }, { status: 400 });
  }

  const built = buildRow(body);
  if ("error" in built) {
    return NextResponse.json({ success: false, error: built.error }, { status: 400 });
  }

  // Fail-closed : on chunk + embed AVANT d'écrire dans knowledge_base. Si
  // l'embedding échoue (OpenAI indisponible), rien n'est créé → la base reste
  // cohérente (jamais d'entrée sans ses chunks). Voir récap 6d.
  const chunkTexts = chunkEntry(built.row as KnowledgeRow);
  let embeddings: number[][];
  try {
    embeddings = await embedBatch(chunkTexts);
  } catch (err) {
    console.error("[api/admin/knowledge] Échec embedding (POST) :", err);
    return NextResponse.json(
      { success: false, error: "Indexation impossible pour le moment (service d'embeddings). Réessayez." },
      { status: 502 },
    );
  }

  const supabase = getSupabaseAdmin();
  try {
    const { data, error } = await supabase
      .from("knowledge_base")
      .insert(built.row)
      .select("*")
      .single();

    if (error || !data) {
      console.error("[api/admin/knowledge] Erreur insert :", error?.message);
      return NextResponse.json({ success: false, error: "Création impossible." }, { status: 500 });
    }

    try {
      await insertChunks(supabase, data.id, chunkTexts, embeddings);
    } catch (chunkErr) {
      // Rollback : on retire l'entrée pour ne pas laisser d'orphelin sans chunks.
      console.error("[api/admin/knowledge] Échec insert chunks, rollback :", chunkErr);
      await supabase.from("knowledge_base").delete().eq("id", data.id);
      return NextResponse.json({ success: false, error: "Indexation impossible." }, { status: 500 });
    }

    return NextResponse.json({ success: true, entry: data }, { status: 201 });
  } catch (err) {
    console.error("[api/admin/knowledge] Exception POST :", err);
    return NextResponse.json({ success: false, error: "Erreur serveur." }, { status: 500 });
  }
}

// ── PATCH : éditer une entrée ────────────────────────────────────────────────
export async function PATCH(request: NextRequest) {
  const unauth = await requireAdmin(request);
  if (unauth) return unauth;

  const body = await parseBody(request);
  if (!body) {
    return NextResponse.json({ success: false, error: "Requête invalide." }, { status: 400 });
  }

  const id = isNonEmptyString(body.id) ? body.id.trim() : "";
  if (!id) {
    return NextResponse.json({ success: false, error: "Identifiant manquant." }, { status: 400 });
  }

  const built = buildRow(body);
  if ("error" in built) {
    return NextResponse.json({ success: false, error: built.error }, { status: 400 });
  }

  // Fail-closed : on ré-embed AVANT de modifier quoi que ce soit. Si l'embedding
  // échoue, l'entrée ET ses chunks existants restent inchangés (cohérents).
  const chunkTexts = chunkEntry(built.row as KnowledgeRow);
  let embeddings: number[][];
  try {
    embeddings = await embedBatch(chunkTexts);
  } catch (err) {
    console.error("[api/admin/knowledge] Échec embedding (PATCH) :", err);
    return NextResponse.json(
      { success: false, error: "Ré-indexation impossible pour le moment (service d'embeddings). Réessayez." },
      { status: 502 },
    );
  }

  const supabase = getSupabaseAdmin();
  try {
    // updated_at est géré par le trigger Postgres (voir knowledge_base.sql).
    const { data, error } = await supabase
      .from("knowledge_base")
      .update(built.row)
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) {
      console.error("[api/admin/knowledge] Erreur update :", error.message);
      return NextResponse.json({ success: false, error: "Mise à jour impossible." }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ success: false, error: "Entrée introuvable." }, { status: 404 });
    }

    // Remplacement des chunks : on supprime les anciens puis on recrée.
    const { error: delErr } = await supabase
      .from("knowledge_chunks")
      .delete()
      .eq("source_id", id);
    if (delErr) {
      console.error("[api/admin/knowledge] Erreur suppression anciens chunks :", delErr.message);
      return NextResponse.json({ success: false, error: "Ré-indexation impossible." }, { status: 500 });
    }
    await insertChunks(supabase, id, chunkTexts, embeddings);

    return NextResponse.json({ success: true, entry: data });
  } catch (err) {
    console.error("[api/admin/knowledge] Exception PATCH :", err);
    return NextResponse.json({ success: false, error: "Erreur serveur." }, { status: 500 });
  }
}

// ── DELETE : supprimer une entrée (UNIQUEMENT knowledge_base) ─────────────────
export async function DELETE(request: NextRequest) {
  const unauth = await requireAdmin(request);
  if (unauth) return unauth;

  const body = await parseBody(request);
  if (!body) {
    return NextResponse.json({ success: false, error: "Requête invalide." }, { status: 400 });
  }

  const id = isNonEmptyString(body.id) ? body.id.trim() : "";
  if (!id) {
    return NextResponse.json({ success: false, error: "Identifiant manquant." }, { status: 400 });
  }

  try {
    // La suppression ne cible QUE la table knowledge_base — jamais devis.
    // Les chunks liés partent automatiquement via la FK ON DELETE CASCADE
    // (source_id → knowledge_base.id, voir knowledge_chunks.sql).
    const { data, error } = await getSupabaseAdmin()
      .from("knowledge_base")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("[api/admin/knowledge] Erreur delete :", error.message);
      return NextResponse.json({ success: false, error: "Suppression impossible." }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ success: false, error: "Entrée introuvable." }, { status: 404 });
    }
    return NextResponse.json({ success: true, id: data.id });
  } catch (err) {
    console.error("[api/admin/knowledge] Exception DELETE :", err);
    return NextResponse.json({ success: false, error: "Erreur serveur." }, { status: 500 });
  }
}
