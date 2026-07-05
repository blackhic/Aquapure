// ─────────────────────────────────────────────────────────────────────────
// Embeddings OpenAI (text-embedding-3-small, 1536 dimensions).
//
// Serveur UNIQUEMENT : lit OPENAI_API_KEY (pas de préfixe NEXT_PUBLIC_, donc
// jamais dans le bundle client). N'importer que depuis des routes API / code
// serveur. Utilise fetch direct (pas de SDK openai — cohérent avec
// scripts/generate-images.mjs, aucune dépendance ajoutée).
// ─────────────────────────────────────────────────────────────────────────

const OPENAI_EMBEDDINGS_URL = "https://api.openai.com/v1/embeddings";
export const EMBEDDING_MODEL = "text-embedding-3-small";
export const EMBEDDING_DIM = 1536;

const TIMEOUT_MS = 15_000;

// Découpage : ~600 tokens. On approxime par la longueur en caractères
// (≈ 4 caractères par token) → ~2400 caractères, sans vrai tokenizer.
const CHUNK_CHAR_LIMIT = 2400;

type EntryLike = {
  // Chaîne libre : la logique ne distingue que « qa » du reste (document).
  // Les appelants valident déjà que type ∈ {document, qa}.
  type: string;
  title: string | null;
  question: string | null;
  content: string;
};

// ── Chunking « maison » ──────────────────────────────────────────────────────
// - Q/R  → un chunk unique « Question: …\nRéponse: … ».
// - Document → un seul chunk si court ; sinon découpé par paragraphes en
//   agrégeant jusqu'au seuil (~600 tokens). Le titre est préfixé au contenu
//   pour donner du contexte au premier chunk.
export function chunkEntry(entry: EntryLike): string[] {
  if (entry.type === "qa") {
    const q = (entry.question ?? "").trim();
    const a = entry.content.trim();
    return [`Question: ${q}\nRéponse: ${a}`];
  }

  const title = entry.title?.trim();
  const body = entry.content.trim();
  const full = title ? `${title}\n\n${body}` : body;

  if (full.length <= CHUNK_CHAR_LIMIT) return [full];

  const paragraphs = full
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let current = "";

  for (const p of paragraphs) {
    const candidate = current ? `${current}\n\n${p}` : p;
    if (candidate.length > CHUNK_CHAR_LIMIT && current) {
      chunks.push(current);
      current = p;
    } else {
      current = candidate;
    }
    // Un paragraphe seul plus long que la limite : découpe dure.
    while (current.length > CHUNK_CHAR_LIMIT) {
      chunks.push(current.slice(0, CHUNK_CHAR_LIMIT));
      current = current.slice(CHUNK_CHAR_LIMIT);
    }
  }
  if (current.trim()) chunks.push(current.trim());

  return chunks.length ? chunks : [full.slice(0, CHUNK_CHAR_LIMIT)];
}

// ── Appel OpenAI (batch) ─────────────────────────────────────────────────────
// Renvoie un embedding par texte, dans le MÊME ordre que l'entrée.
export async function embedBatch(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];

  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY manquante (embeddings).");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(OPENAI_EMBEDDINGS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: EMBEDDING_MODEL, input: texts }),
      signal: controller.signal,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Appel embeddings OpenAI échoué (réseau/timeout) : ${msg}`);
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    let detail = "";
    try {
      const j = await response.json();
      detail = j?.error?.message || JSON.stringify(j);
    } catch {
      detail = await response.text().catch(() => "");
    }
    throw new Error(`Erreur API embeddings OpenAI (HTTP ${response.status}). ${detail}`);
  }

  const json = (await response.json()) as {
    data: { index: number; embedding: number[] }[];
  };
  // On réordonne par `index` par sécurité (l'API renvoie déjà dans l'ordre).
  return json.data
    .slice()
    .sort((a, b) => a.index - b.index)
    .map((d) => d.embedding);
}

// Variante mono-texte pratique (ex. embed d'une requête de recherche).
export async function embed(text: string): Promise<number[]> {
  const [vector] = await embedBatch([text]);
  return vector;
}

// pgvector attend une représentation textuelle « [v1,v2,…] ». JSON.stringify
// d'un tableau de nombres produit exactement ce format.
export function toVectorLiteral(vector: number[]): string {
  return JSON.stringify(vector);
}
