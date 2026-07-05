import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ─────────────────────────────────────────────────────────────────────────
// Client Supabase « serveur » — utilise la SERVICE ROLE key.
//
// ⚠️ La service_role key est une clé ADMIN :
//   - elle contourne TOTALEMENT la Row Level Security (RLS) ;
//   - elle donne un accès complet en lecture/écriture à toute la base.
//
// Elle ne doit donc JAMAIS être exposée au navigateur :
//   - PAS de préfixe NEXT_PUBLIC_ → elle n'est pas incluse dans le bundle
//     client (uniquement disponible côté serveur via process.env) ;
//   - ce module ne doit être importé QUE par du code serveur (routes API,
//     server actions), jamais par un composant "use client".
//
// Si cette clé fuit, n'importe qui peut lire/écrire toute la base en
// ignorant la RLS. C'est pour ça que les insertions du formulaire de devis
// passeront par une route API serveur (qui détient cette clé), et non par un
// appel direct depuis le navigateur.
// ─────────────────────────────────────────────────────────────────────────

let cached: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Configuration Supabase manquante : définir NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  cached = createClient(url, serviceRoleKey, {
    auth: {
      // Contexte serveur sans session utilisateur : pas de refresh ni de
      // persistance de session.
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return cached;
}
