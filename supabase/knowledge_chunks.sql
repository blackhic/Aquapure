-- ============================================================================
-- AQUAPURE — Embeddings de la base de connaissances (étape 6d)
-- Couche vectorielle (pgvector) pour la recherche par similarité (RAG).
-- À exécuter dans Supabase → SQL Editor, APRÈS knowledge_base.sql.
-- ============================================================================

-- Extension pgvector (types vector + opérateurs de distance).
create extension if not exists vector;

-- ── Table des chunks embeddés ────────────────────────────────────────────────
-- Chaque entrée de knowledge_base est découpée en 1..N chunks ; chaque chunk
-- porte son embedding. ON DELETE CASCADE : supprimer une entrée supprime ses
-- chunks automatiquement (cohérence garantie côté base).
create table if not exists public.knowledge_chunks (
  id          uuid          primary key default gen_random_uuid(),
  source_id   uuid          not null references public.knowledge_base(id) on delete cascade,
  chunk_text  text          not null,
  embedding   vector(1536),               -- dimension de text-embedding-3-small
  created_at  timestamptz   not null default now()
);

-- Index sur source_id : utilisé pour supprimer/recréer les chunks d'une entrée
-- lors d'une édition (PATCH).
create index if not exists knowledge_chunks_source_id_idx
  on public.knowledge_chunks (source_id);

-- ── Index de similarité : HNSW plutôt qu'IVFFlat ─────────────────────────────
-- Choix HNSW pour ce cas :
--   * Faible volume (quelques dizaines/centaines de chunks) : IVFFlat exige
--     assez de lignes pour entraîner ses « listes » (centroïdes) et donne de
--     mauvais résultats sur une table quasi vide ; il faut aussi le (re)créer
--     après avoir chargé les données.
--   * HNSW se construit de façon incrémentale, ne nécessite aucun paramètre de
--     « lists » ni d'ANALYZE, et offre un meilleur rappel — idéal ici.
-- Opérateur cosine (vector_cosine_ops) : cohérent avec l'embedding OpenAI
-- (vecteurs normalisés → similarité cosinus).
create index if not exists knowledge_chunks_embedding_idx
  on public.knowledge_chunks
  using hnsw (embedding vector_cosine_ops);

-- RLS activée, SANS policy (comme knowledge_base / devis) : aucun accès anon.
-- Tout passe par les routes serveur (service_role, contourne la RLS).
alter table public.knowledge_chunks enable row level security;

-- ── RPC de recherche par similarité ──────────────────────────────────────────
-- Appelée par les routes serveur (recherche 6d, chatbot 6e). Renvoie les
-- match_count chunks les plus proches (distance cosinus croissante).
--   distance   = kc.embedding <=> query_embedding   (0 = identique)
--   similarity = 1 - distance                        (1 = identique)
create or replace function public.match_knowledge_chunks(
  query_embedding vector(1536),
  match_count int default 5
)
returns table (
  id         uuid,
  source_id  uuid,
  chunk_text text,
  distance   float,
  similarity float
)
language sql
stable
as $$
  select
    kc.id,
    kc.source_id,
    kc.chunk_text,
    (kc.embedding <=> query_embedding)       as distance,
    1 - (kc.embedding <=> query_embedding)   as similarity
  from public.knowledge_chunks kc
  where kc.embedding is not null
  order by kc.embedding <=> query_embedding
  limit match_count;
$$;
