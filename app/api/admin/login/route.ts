import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  SESSION_DURATION_MS,
  verifyPassword,
  createSessionToken,
} from "@/app/lib/adminAuth";

// Web Crypto suffit (Edge-compatible), mais on reste en Node.js par cohérence
// avec les autres routes et pour lire les env vars serveur.
export const runtime = "nodejs";

type LoginPayload = { password?: unknown };

export async function POST(request: Request) {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET;

  // Sans configuration serveur, on ne peut pas authentifier : 500 générique.
  if (!ADMIN_PASSWORD || !ADMIN_SESSION_SECRET) {
    console.error(
      "[api/admin/login] ADMIN_PASSWORD ou ADMIN_SESSION_SECRET manquant.",
    );
    return NextResponse.json(
      { success: false, error: "Authentification indisponible." },
      { status: 500 },
    );
  }

  let body: LoginPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Requête invalide." },
      { status: 400 },
    );
  }

  const password = typeof body.password === "string" ? body.password : "";

  const ok = await verifyPassword(password, ADMIN_PASSWORD);
  if (!ok) {
    return NextResponse.json(
      { success: false, error: "Mot de passe incorrect." },
      { status: 401 },
    );
  }

  const token = await createSessionToken(ADMIN_SESSION_SECRET);
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(SESSION_DURATION_MS / 1000),
  });
  return response;
}
