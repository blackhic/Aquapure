import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/app/lib/supabase";
import {
  sendDevisNotification,
  sendClientAcknowledgement,
  type DevisData,
} from "@/app/lib/email";

// Route exécutée côté serveur Node.js (la service_role key n'est jamais
// envoyée au navigateur).
export const runtime = "nodejs";

type DevisPayload = {
  nom?: unknown;
  telephone?: unknown;
  email?: unknown;
  type_besoin?: unknown;
  message?: unknown;
  urgence?: unknown;
  canal_prefere?: unknown;
};

const isNonEmptyString = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;

export async function POST(request: Request) {
  // 1. Parse du corps JSON
  let body: DevisPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Corps de requête invalide (JSON attendu)." },
      { status: 400 },
    );
  }

  // 2. Validation des champs obligatoires (côté serveur)
  const missing: string[] = [];
  if (!isNonEmptyString(body.nom)) missing.push("nom");
  if (!isNonEmptyString(body.telephone)) missing.push("telephone");
  if (!isNonEmptyString(body.type_besoin)) missing.push("type_besoin");
  if (missing.length > 0) {
    return NextResponse.json(
      {
        success: false,
        error: `Champs obligatoires manquants : ${missing.join(", ")}.`,
      },
      { status: 400 },
    );
  }

  // 3. Construction de la ligne (uniquement les colonnes attendues ;
  //    statut laissé au défaut 'nouveau' côté base).
  const row = {
    nom: (body.nom as string).trim(),
    telephone: (body.telephone as string).trim(),
    email: isNonEmptyString(body.email) ? (body.email as string).trim() : null,
    type_besoin: (body.type_besoin as string).trim(),
    message: isNonEmptyString(body.message)
      ? (body.message as string).trim()
      : null,
    urgence: body.urgence === true,
    canal_prefere: isNonEmptyString(body.canal_prefere)
      ? (body.canal_prefere as string).trim()
      : null,
  };

  // 4. Insertion via le client service_role (bypass RLS)
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("devis")
      .insert(row)
      .select("id, created_at")
      .single();

    if (error) {
      // Log détaillé côté serveur uniquement ; message générique au client.
      console.error("[api/devis] Erreur insertion Supabase :", error.message);
      return NextResponse.json(
        {
          success: false,
          error: "Impossible d'enregistrer la demande pour le moment.",
        },
        { status: 500 },
      );
    }

    // ── Notifications email (Resend) — NON bloquantes ──
    // La demande est DÉJÀ enregistrée : un échec d'envoi ne doit jamais
    // empêcher de renvoyer un succès au client (ne pas perdre le lead).
    // Chaque envoi a son propre catch → l'échec de l'un n'empêche pas l'autre.
    const devis: DevisData = { ...row, id: data.id, created_at: data.created_at };
    await Promise.allSettled([
      sendDevisNotification(devis).catch((e) =>
        console.error("[api/devis] Échec email notification :", e),
      ),
      sendClientAcknowledgement(devis).catch((e) =>
        console.error("[api/devis] Échec email accusé client :", e),
      ),
    ]);

    return NextResponse.json({ success: true, id: data.id }, { status: 201 });
  } catch (err) {
    console.error("[api/devis] Exception :", err);
    return NextResponse.json(
      { success: false, error: "Erreur serveur." },
      { status: 500 },
    );
  }
}
