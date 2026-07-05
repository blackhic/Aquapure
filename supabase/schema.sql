-- ============================================================================
-- AQUAPURE — Schéma de la table des demandes de devis
-- À exécuter dans Supabase → SQL Editor.
-- ============================================================================

create table if not exists public.devis (
  id            uuid        primary key default gen_random_uuid(),
  created_at    timestamptz not null   default now(),
  nom           text        not null,
  telephone     text        not null,
  email         text,
  type_besoin   text        not null,   -- dépannage / rénovation / chauffe-eau / fuite / plomberie générale / autre
  message       text,
  urgence       boolean     not null   default false,
  canal_prefere text,                   -- telephone / whatsapp / email
  statut        text        not null   default 'nouveau'  -- nouveau / traité (admin, étape 6)
);

-- Row Level Security : activée, SANS aucune policy.
-- → Le rôle "anon" (clé publique, navigateur) n'a AUCUN accès à la table.
-- → Les insertions passent par la route API serveur /api/devis, qui utilise
--   la service_role key. Cette clé contourne la RLS (accès admin), et n'est
--   jamais exposée au navigateur.
-- Ce choix évite d'ouvrir une policy d'insertion publique (qui permettrait à
-- n'importe qui d'écrire dans la table directement depuis le front, avec les
-- risques de spam / abus que ça implique).
alter table public.devis enable row level security;
