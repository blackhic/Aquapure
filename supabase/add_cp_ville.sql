-- ============================================================================
-- AQUAPURE — Ajout code postal + ville aux demandes de devis (étape 7e)
-- Détection auto de la ville via geo.api.gouv.fr côté formulaire.
-- À exécuter dans Supabase → SQL Editor, APRÈS schema.sql.
-- ============================================================================

-- Colonnes NULLABLE au niveau base : ne casse pas les lignes existantes (devis
-- déjà enregistrés sans CP) ni les leads chatbot (qui n'ont pas de CP → null).
-- L'obligation « CP + ville requis » est imposée côté formulaire ET revalidée
-- côté serveur (/api/devis) pour les nouvelles demandes du formulaire public.
alter table public.devis add column if not exists code_postal text;
alter table public.devis add column if not exists ville       text;
