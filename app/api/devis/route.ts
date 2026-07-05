import { NextResponse } from "next/server";
import { createDevis } from "@/app/lib/devis";

// Route exécutée côté serveur Node.js (la service_role key n'est jamais
// envoyée au navigateur).
export const runtime = "nodejs";

type DevisPayload = {
  nom?: unknown;
  telephone?: unknown;
  email?: unknown;
  code_postal?: unknown;
  ville?: unknown;
  type_besoin?: unknown;
  message?: unknown;
  urgence?: unknown;
  canal_prefere?: unknown;
};

const isNonEmptyString = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;

// Code postal FR : exactement 5 chiffres.
const isPostalValid = (v: unknown): v is string =>
  typeof v === "string" && /^\d{5}$/.test(v.trim());

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
  if (!isNonEmptyString(body.ville)) missing.push("ville");
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

  // Code postal : requis + format strict (5 chiffres).
  if (!isPostalValid(body.code_postal)) {
    return NextResponse.json(
      { success: false, error: "Code postal invalide (5 chiffres attendus)." },
      { status: 400 },
    );
  }

  // 3. Construction de la ligne (uniquement les colonnes attendues ;
  //    statut laissé au défaut 'nouveau' côté base).
  const row = {
    nom: (body.nom as string).trim(),
    telephone: (body.telephone as string).trim(),
    email: isNonEmptyString(body.email) ? (body.email as string).trim() : null,
    code_postal: (body.code_postal as string).trim(),
    ville: (body.ville as string).trim(),
    type_besoin: (body.type_besoin as string).trim(),
    message: isNonEmptyString(body.message)
      ? (body.message as string).trim()
      : null,
    urgence: body.urgence === true,
    canal_prefere: isNonEmptyString(body.canal_prefere)
      ? (body.canal_prefere as string).trim()
      : null,
  };

  // 4. Insertion + notifications (service_role + Resend non bloquant)
  //    via le helper partagé avec /api/chat/lead.
  try {
    const { id } = await createDevis(row);
    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (err) {
    console.error("[api/devis] Échec création devis :", err);
    return NextResponse.json(
      {
        success: false,
        error: "Impossible d'enregistrer la demande pour le moment.",
      },
      { status: 500 },
    );
  }
}
