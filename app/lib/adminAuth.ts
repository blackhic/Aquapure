// Authentification admin — un seul mot de passe (un seul admin : Mehdi).
//
// Ce module n'utilise QUE l'API Web Crypto (`crypto.subtle`), disponible à la
// fois dans le runtime Node.js (routes API) et dans le runtime Edge
// (middleware). Aucune dépendance externe, aucun import Node-only : il peut donc
// être partagé par `middleware.ts` et les routes `/api/admin/*`.

// Nom du cookie de session (httpOnly, signé HMAC).
export const ADMIN_COOKIE = "admin_session";

// Durée de validité d'une session : ~7 jours.
export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

const encoder = new TextEncoder();

// Convertit un ArrayBuffer en chaîne hexadécimale (longueur fixe → pas de fuite
// d'information sur le contenu).
function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// HMAC-SHA256(message, secret) → hex.
async function hmacHex(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return toHex(sig);
}

// SHA-256(message) → hex. Sert à comparer des secrets en temps constant sans
// fuiter leur longueur (les deux digests font toujours 64 caractères hex).
async function sha256Hex(message: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(message));
  return toHex(digest);
}

// Comparaison en temps constant de deux chaînes de MÊME longueur attendue
// (ici : des digests/HMAC hex de 64 caractères). Le XOR accumulé évite de
// court-circuiter dès la première différence.
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

// Compare le mot de passe reçu à celui attendu en temps constant. On hash les
// deux en SHA-256 d'abord : la comparaison porte alors sur deux chaînes de
// longueur identique (64 hex), sans révéler la longueur du mot de passe réel.
export async function verifyPassword(
  received: string,
  expected: string,
): Promise<boolean> {
  const [a, b] = await Promise.all([sha256Hex(received), sha256Hex(expected)]);
  return constantTimeEqual(a, b);
}

// Crée un token de session signé : `${expiration}.${hmac(expiration)}`.
// Le payload est le timestamp (ms) d'expiration ; la signature HMAC-SHA256
// avec le secret empêche toute falsification ou prolongation côté client.
export async function createSessionToken(
  secret: string,
  now: number = Date.now(),
): Promise<string> {
  const exp = now + SESSION_DURATION_MS;
  const sig = await hmacHex(String(exp), secret);
  return `${exp}.${sig}`;
}

// Vérifie un token de session : signature valide ET non expiré.
export async function verifySessionToken(
  token: string | undefined,
  secret: string,
  now: number = Date.now(),
): Promise<boolean> {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot <= 0) return false;

  const expPart = token.slice(0, dot);
  const sigPart = token.slice(dot + 1);

  const exp = Number(expPart);
  if (!Number.isFinite(exp)) return false;

  // Signature d'abord (temps constant), puis expiration.
  const expected = await hmacHex(expPart, secret);
  if (!constantTimeEqual(sigPart, expected)) return false;

  return exp > now;
}
