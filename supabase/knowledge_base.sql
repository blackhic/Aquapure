-- ============================================================================
-- AQUAPURE — Base de connaissances (étape 6c)
-- Contenu brut alimenté par Mehdi, destiné au futur chatbot (embeddings en 6d).
-- À exécuter dans Supabase → SQL Editor.
-- ============================================================================

create table if not exists public.knowledge_base (
  id          uuid        primary key default gen_random_uuid(),
  created_at  timestamptz not null   default now(),
  updated_at  timestamptz not null   default now(),
  type        text        not null   check (type in ('document', 'qa')),
  title       text,                  -- titre du document ; libellé court optionnel pour une Q/R
  question    text,                  -- Q/R uniquement
  content     text        not null   -- corps du document, ou réponse de la Q/R
);

-- Tri par date de création décroissante (liste admin).
create index if not exists knowledge_base_created_at_idx
  on public.knowledge_base (created_at desc);

-- ── updated_at automatique via trigger ──────────────────────────────────────
-- Met à jour updated_at à chaque UPDATE, sans dépendre de l'API.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists knowledge_base_set_updated_at on public.knowledge_base;
create trigger knowledge_base_set_updated_at
  before update on public.knowledge_base
  for each row execute function public.set_updated_at();

-- ── Row Level Security : activée, SANS aucune policy ─────────────────────────
-- Comme la table `devis` : le rôle "anon" (navigateur) n'a AUCUN accès.
-- Tout passe par les routes serveur /api/admin/knowledge, qui utilisent la
-- service_role key (contourne la RLS, jamais exposée au navigateur).
alter table public.knowledge_base enable row level security;
