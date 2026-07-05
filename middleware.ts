import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/app/lib/adminAuth";

// Protège /admin/* (sauf la page de login). Le middleware s'exécute dans le
// runtime Edge : on n'utilise que Web Crypto (via `verifySessionToken`).
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // La page de login doit rester accessible sans session.
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const secret = process.env.ADMIN_SESSION_SECRET;
  const token = request.cookies.get(ADMIN_COOKIE)?.value;

  const valid = secret ? await verifySessionToken(token, secret) : false;
  if (valid) {
    return NextResponse.next();
  }

  // Session absente/invalide/expirée → redirection vers le login.
  const loginUrl = new URL("/admin/login", request.url);
  return NextResponse.redirect(loginUrl);
}

// Ne fait tourner le middleware que sur /admin/:path* (login inclus, filtré
// ci-dessus). Le reste du site n'est jamais impacté.
export const config = {
  matcher: ["/admin/:path*"],
};
