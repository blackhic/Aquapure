import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/app/lib/supabase";
import { ADMIN_COOKIE, verifySessionToken } from "@/app/lib/adminAuth";
import { embed, toVectorLiteral } from "@/app/lib/embeddings";

export const runtime = "nodejs";

// Recherche par similarité (livrable vérifiable de 6d). Protégée par le cookie
// admin. Embed la requête `q`, puis récupère les top-k chunks via la RPC
// match_knowledge_chunks. Le chatbot public (6e) réutilisera la même RPC.
//
//   GET /api/admin/knowledge/search?q=vous intervenez la nuit ?&k=5
export async function GET(request: NextRequest) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const authorized = secret ? await verifySessionToken(token, secret) : false;
  if (!authorized) {
    return NextResponse.json({ success: false, error: "Non autorisé." }, { status: 401 });
  }

  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (!q) {
    return NextResponse.json(
      { success: false, error: "Paramètre `q` (requête) manquant." },
      { status: 400 },
    );
  }

  const kRaw = Number(request.nextUrl.searchParams.get("k"));
  const k = Number.isFinite(kRaw) && kRaw > 0 ? Math.min(Math.floor(kRaw), 20) : 5;

  let queryEmbedding: number[];
  try {
    queryEmbedding = await embed(q);
  } catch (err) {
    console.error("[api/admin/knowledge/search] Échec embedding requête :", err);
    return NextResponse.json(
      { success: false, error: "Recherche indisponible (service d'embeddings)." },
      { status: 502 },
    );
  }

  try {
    const { data, error } = await getSupabaseAdmin().rpc("match_knowledge_chunks", {
      query_embedding: toVectorLiteral(queryEmbedding),
      match_count: k,
    });

    if (error) {
      console.error("[api/admin/knowledge/search] Erreur RPC :", error.message);
      return NextResponse.json({ success: false, error: "Recherche impossible." }, { status: 500 });
    }

    return NextResponse.json({ success: true, query: q, count: data?.length ?? 0, results: data ?? [] });
  } catch (err) {
    console.error("[api/admin/knowledge/search] Exception :", err);
    return NextResponse.json({ success: false, error: "Erreur serveur." }, { status: 500 });
  }
}
