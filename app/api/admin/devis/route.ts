import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/app/lib/supabase";
import { ADMIN_COOKIE, verifySessionToken } from "@/app/lib/adminAuth";

export const runtime = "nodejs";

// Statuts autorisés. Aucune autre valeur n'est acceptée, et cette route ne
// permet QUE la mise à jour du statut (jamais de suppression).
const STATUTS = new Set(["nouveau", "traité"]);

type PatchPayload = { id?: unknown; statut?: unknown };

export async function PATCH(request: NextRequest) {
  // 1. Garde d'authentification explicite : le middleware protège les *pages*
  //    /admin/*, mais pas les routes /api. On revérifie donc ici le cookie de
  //    session admin (même mécanisme HMAC que le middleware).
  const secret = process.env.ADMIN_SESSION_SECRET;
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const authorized = secret ? await verifySessionToken(token, secret) : false;
  if (!authorized) {
    return NextResponse.json(
      { success: false, error: "Non autorisé." },
      { status: 401 },
    );
  }

  // 2. Parse + validation du corps
  let body: PatchPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Requête invalide." },
      { status: 400 },
    );
  }

  const id = typeof body.id === "string" ? body.id.trim() : "";
  const statut = typeof body.statut === "string" ? body.statut : "";

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Identifiant manquant." },
      { status: 400 },
    );
  }
  if (!STATUTS.has(statut)) {
    return NextResponse.json(
      { success: false, error: "Statut invalide." },
      { status: 400 },
    );
  }

  // 3. Mise à jour (service_role, côté serveur uniquement)
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("devis")
      .update({ statut })
      .eq("id", id)
      .select("*")
      // maybeSingle : 0 ligne → data null (pas d'erreur), ce qui nous permet de
      // renvoyer un 404 propre au lieu d'un 500. single() lèverait une erreur.
      .maybeSingle();

    if (error) {
      console.error("[api/admin/devis] Erreur update Supabase :", error.message);
      return NextResponse.json(
        { success: false, error: "Mise à jour impossible." },
        { status: 500 },
      );
    }
    if (!data) {
      return NextResponse.json(
        { success: false, error: "Demande introuvable." },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, devis: data });
  } catch (err) {
    console.error("[api/admin/devis] Exception :", err);
    return NextResponse.json(
      { success: false, error: "Erreur serveur." },
      { status: 500 },
    );
  }
}
