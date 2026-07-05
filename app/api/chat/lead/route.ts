import { NextResponse, type NextRequest } from "next/server";
import { createDevis } from "@/app/lib/devis";

// Capture de lead depuis le chatbot « Aqua ». Route PUBLIQUE (comme /api/chat) :
// validation stricte + garde-fou anti-abus léger pour éviter le spam
// d'insertions. Réutilise le helper createDevis (insert service_role + emails
// Resend non bloquants) → le lead atterrit dans la table `devis` existante et
// déclenche exactement la même notif qu'un devis normal.
export const runtime = "nodejs";

// Plafonds de longueur (anti-abus).
const MAX_NOM = 100;
const MAX_TEL = 30;
const MAX_EMAIL = 150;
const MAX_BESOIN = 500;

// Rate-limit EN MÉMOIRE, best-effort (non partagé entre instances serverless —
// cf. /api/chat). Plus strict que le chat car chaque appel écrit en base.
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
const normalizePhone = (v: string) => v.replace(/[\s.\-()]/g, "");
const isPhoneValid = (v: string) => /^(?:\+33|0)[1-9]\d{8}$/.test(normalizePhone(v));
const isEmailValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export async function POST(request: NextRequest) {
  const now = Date.now();

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip, now)) {
    return NextResponse.json(
      { success: false, error: "Trop de demandes. Réessayez dans une minute." },
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
  const nom = str(b.nom);
  const telephone = str(b.telephone);
  const email = str(b.email);
  const besoin = str(b.besoin);

  // Validation stricte (nom + téléphone requis).
  if (!nom) {
    return NextResponse.json(
      { success: false, error: "Merci d'indiquer votre nom." },
      { status: 400 },
    );
  }
  if (!telephone) {
    return NextResponse.json(
      { success: false, error: "Merci d'indiquer votre téléphone." },
      { status: 400 },
    );
  }
  if (!isPhoneValid(telephone)) {
    return NextResponse.json(
      { success: false, error: "Numéro de téléphone invalide." },
      { status: 400 },
    );
  }
  if (email && !isEmailValid(email)) {
    return NextResponse.json(
      { success: false, error: "Adresse email invalide." },
      { status: 400 },
    );
  }
  if (
    nom.length > MAX_NOM ||
    telephone.length > MAX_TEL ||
    email.length > MAX_EMAIL ||
    besoin.length > MAX_BESOIN
  ) {
    return NextResponse.json(
      { success: false, error: "Champs trop longs." },
      { status: 400 },
    );
  }

  // Marqueur d'origine : préfixe [Chatbot] dans le message (aucune colonne
  // ajoutée au schéma). canal_prefere = "telephone" (demande de rappel).
  const row = {
    nom,
    telephone,
    email: email || null,
    type_besoin: "Rappel (chatbot)",
    message: `[Chatbot] ${besoin || "Demande de rappel via l'assistant Aqua."}`,
    urgence: false,
    canal_prefere: "telephone",
  };

  try {
    await createDevis(row);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("[api/chat/lead] Échec création lead :", err);
    return NextResponse.json(
      { success: false, error: "Impossible d'enregistrer la demande." },
      { status: 500 },
    );
  }
}
