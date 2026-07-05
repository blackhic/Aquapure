import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/app/lib/supabase";
import { ADMIN_COOKIE, verifySessionToken } from "@/app/lib/adminAuth";

export const runtime = "nodejs";

const TYPES = new Set(["document", "qa"]);

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

  try {
    const { data, error } = await getSupabaseAdmin()
      .from("knowledge_base")
      .insert(built.row)
      .select("*")
      .single();

    if (error) {
      console.error("[api/admin/knowledge] Erreur insert :", error.message);
      return NextResponse.json({ success: false, error: "Création impossible." }, { status: 500 });
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

  try {
    // updated_at est géré par le trigger Postgres (voir knowledge_base.sql).
    const { data, error } = await getSupabaseAdmin()
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
