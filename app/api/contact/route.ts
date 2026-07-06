import { NextResponse, type NextRequest } from "next/server";
import { sendContactMessage } from "@/app/lib/email";

// Route publique du formulaire de contact : validation stricte + garde-fou
// anti-abus léger, puis envoi Resend vers la boîte AQUAPURE. Serveur only.
export const runtime = "nodejs";

const MAX_NOM = 100;
const MAX_EMAIL = 150;
const MAX_TEL = 30;
const MAX_MESSAGE = 3000;

// Rate-limit EN MÉMOIRE, best-effort (non partagé entre instances serverless —
// cf. /api/chat/lead). Frein anti-spam suffisant pour une v1.
const RATE_LIMIT = 5;
const WINDOW_MS = 60_000;
const ipHits = new Map<string, number[]>();

function rateLimited(ip: string, now: number): boolean {
  const recent = (ipHits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  ipHits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");
const isEmailValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const normalizePhone = (v: string) => v.replace(/[\s.\-()]/g, "");
const isPhoneValid = (v: string) => /^(?:\+33|0)[1-9]\d{8}$/.test(normalizePhone(v));
const isPostalValid = (v: string) => /^\d{5}$/.test(v);

export async function POST(request: NextRequest) {
  const now = Date.now();
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip, now)) {
    return NextResponse.json(
      { success: false, error: "Trop de messages. Réessayez dans une minute." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Requête invalide." },
      { status: 400 },
    );
  }

  const b = (body ?? {}) as Record<string, unknown>;
  const nom = str(b.nom); // facultatif
  const prenom = str(b.prenom);
  const email = str(b.email);
  const telephone = str(b.telephone);
  const codePostal = str(b.code_postal);
  const ville = str(b.ville);
  const message = str(b.message);

  // Champs obligatoires (miroir du formulaire) — le nom est facultatif.
  const missing: string[] = [];
  if (!prenom) missing.push("prénom");
  if (!email) missing.push("email");
  if (!telephone) missing.push("téléphone");
  if (!ville) missing.push("ville");
  if (!message) missing.push("message");
  if (missing.length > 0) {
    return NextResponse.json(
      { success: false, error: `Champs obligatoires manquants : ${missing.join(", ")}.` },
      { status: 400 },
    );
  }
  if (!isEmailValid(email)) {
    return NextResponse.json(
      { success: false, error: "Adresse email invalide." },
      { status: 400 },
    );
  }
  if (!isPhoneValid(telephone)) {
    return NextResponse.json(
      { success: false, error: "Numéro de téléphone invalide." },
      { status: 400 },
    );
  }
  if (!isPostalValid(codePostal)) {
    return NextResponse.json(
      { success: false, error: "Code postal invalide (5 chiffres attendus)." },
      { status: 400 },
    );
  }
  if (
    nom.length > MAX_NOM ||
    prenom.length > MAX_NOM ||
    email.length > MAX_EMAIL ||
    telephone.length > MAX_TEL ||
    message.length > MAX_MESSAGE
  ) {
    return NextResponse.json(
      { success: false, error: "Un ou plusieurs champs sont trop longs." },
      { status: 400 },
    );
  }

  try {
    await sendContactMessage({
      nom: nom || null,
      prenom,
      email,
      telephone,
      code_postal: codePostal,
      ville,
      message,
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[api/contact] Échec envoi message de contact :", err);
    return NextResponse.json(
      {
        success: false,
        error:
          "Impossible d'envoyer le message pour le moment. Réessayez ou appelez-nous au 04 84 35 04 86.",
      },
      { status: 502 },
    );
  }
}
