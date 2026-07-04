// Génération d'images via l'API OpenAI (modèle gpt-image-2).
// Écrit chaque image dans public/photos/.
//
// Usage :  npm run generate-images
// Prérequis : OPENAI_API_KEY défini dans .env.local (jamais commité).
//
// Doc : POST https://api.openai.com/v1/images/generations
//   model: "gpt-image-2", size, quality, output_format (png|jpeg|webp)
//   → réponse : data[0].b64_json (image en base64)

import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";

// ── Configuration ──
const MODEL = "gpt-image-2";
const OUTPUT_DIR = path.resolve(process.cwd(), "public", "photos");
const OUTPUT_FORMAT = "webp"; // "png" | "jpeg" | "webp"
const SIZE = "1024x1024";
const QUALITY = "high"; // "low" | "medium" | "high" | "auto"

// ── Liste des images à générer : { nom_fichier, prompt } ──
const IMAGES = [
  {
    nom_fichier: "hero-plombier-nice",
    prompt:
      "Photorealistic professional plumber standing next to a white service van parked on a residential street in front of a Mediterranean villa in the Nice area. On the van: a stylized blue gradient water-drop logo, text 'AQUAPURE Plomberie', and phone '04 84 35 04 86'. Navy uniform with the same small water-drop logo and 'AQUAPURE Plomberie'. Natural daylight, realistic, commercial, sharp. No beach, no seafront.",
  },
  {
    nom_fichier: "depannage-urgence",
    prompt:
      "Photorealistic close-up of a plumber's hands repairing a leaking pipe under a sink with a wrench, water droplets, focused work, realistic textures, natural light. No brand visible.",
  },
  {
    nom_fichier: "renovation-salle-de-bain",
    prompt:
      "Photorealistic modern renovated bathroom, walk-in Italian shower, elegant tiling, wall-mounted vanity, bright, high-end residential interior, natural light. No text.",
  },
  {
    nom_fichier: "chauffe-eau",
    prompt:
      "Photorealistic plumber in navy uniform with blue water-drop 'AQUAPURE Plomberie' logo installing a modern white water heater tank on a wall, tools nearby, realistic lighting. No third-party brand.",
  },
  {
    nom_fichier: "recherche-de-fuite",
    prompt:
      "Photorealistic plumber using a generic handheld acoustic leak detection device and a thermal camera near a wall, concentrated, professional equipment WITHOUT any brand logo, indoor residential setting, realistic.",
  },
  {
    nom_fichier: "plomberie-generale",
    prompt:
      "Photorealistic plumber installing a kitchen sink faucet, connecting pipes under a modern kitchen, navy uniform with blue water-drop 'AQUAPURE Plomberie' logo, tools, natural light, realistic.",
  },
  {
    nom_fichier: "avant-renovation",
    prompt:
      "Photorealistic old worn-out bathroom before renovation, dated tiles, old bathtub, slightly damaged, realistic, natural light. No text.",
  },
  {
    nom_fichier: "apres-renovation",
    prompt:
      "Photorealistic beautifully renovated modern bathroom after renovation, walk-in shower, fresh tiling, elegant fixtures, bright and clean. No text.",
  },
  {
    nom_fichier: "plomberie-piscine-villa",
    prompt:
      "Photorealistic plumber in navy uniform with a blue water-drop 'AQUAPURE Plomberie' logo working on swimming pool plumbing at a Mediterranean villa: pool pump, filter and PVC pipes in a poolside technical room, the luxury villa swimming pool visible in the background, natural daylight, realistic, professional. No third-party brand, no text other than the AQUAPURE logo.",
  },
];

// ── Chargement de OPENAI_API_KEY depuis .env.local ──
const ENV_PATH = path.resolve(process.cwd(), ".env.local");
try {
  process.loadEnvFile(ENV_PATH);
} catch {
  // Non bloquant : la clé peut déjà être présente dans l'environnement.
}

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) {
  console.error(
    [
      "❌ OPENAI_API_KEY introuvable.",
      "   Ajoute cette ligne dans .env.local (à la racine du projet) :",
      "",
      "     OPENAI_API_KEY=sk-...ta_cle...",
      "",
      "   (Le fichier .env.local est ignoré par git — la clé ne sera pas commitée.)",
    ].join("\n"),
  );
  process.exit(1);
}

async function generateOne({ nom_fichier, prompt }) {
  console.log(`🎨 Génération : ${nom_fichier} …`);

  let response;
  try {
    response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        prompt,
        size: SIZE,
        quality: QUALITY,
        output_format: OUTPUT_FORMAT,
        n: 1,
        // Streaming : des images partielles arrivent pendant la génération,
        // ce qui garde la connexion active (évite les coupures d'inactivité
        // sur les générations haute qualité, plus longues).
        stream: true,
        partial_images: 2,
      }),
    });
  } catch (err) {
    // Erreur réseau (DNS, coupure, timeout…)
    throw new Error(`échec réseau lors de l'appel à l'API OpenAI (${err.message})`);
  }

  if (!response.ok) {
    let detail = "";
    try {
      const errJson = await response.json();
      detail = errJson?.error?.message || JSON.stringify(errJson);
    } catch {
      detail = await response.text().catch(() => "");
    }
    if (response.status === 401) {
      throw new Error(`clé API refusée (401) — vérifie OPENAI_API_KEY. ${detail}`);
    }
    if (response.status === 403) {
      throw new Error(
        `accès refusé (403) — vérification d'organisation requise pour gpt-image-2 ? ${detail}`,
      );
    }
    if (response.status === 429) {
      throw new Error(`quota / rate limit atteint (429). ${detail}`);
    }
    throw new Error(`erreur API OpenAI (HTTP ${response.status}). ${detail}`);
  }

  // ── Lecture du flux SSE ──
  // Événements : "image_generation.partial_image" (aperçus) puis
  // "image_generation.completed" (image finale). base64 dans b64_json.
  const decoder = new TextDecoder();
  let sseBuffer = "";
  let finalB64 = null;
  let lastPartialB64 = null;

  for await (const chunk of response.body) {
    sseBuffer += decoder.decode(chunk, { stream: true });
    let nl;
    while ((nl = sseBuffer.indexOf("\n")) !== -1) {
      const line = sseBuffer.slice(0, nl).trim();
      sseBuffer = sseBuffer.slice(nl + 1);
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      let evt;
      try {
        evt = JSON.parse(payload);
      } catch {
        continue;
      }
      if (evt.type === "image_generation.partial_image") {
        lastPartialB64 = evt.b64_json;
        process.stdout.write("·"); // progression : un point par aperçu reçu
      } else if (evt.type === "image_generation.completed") {
        finalB64 = evt.b64_json;
      } else if (typeof evt.type === "string" && evt.type.endsWith("error")) {
        throw new Error(evt.error?.message || "erreur pendant le streaming.");
      }
    }
  }
  process.stdout.write("\n");

  const b64 = finalB64 || lastPartialB64;
  if (!b64) {
    throw new Error("réponse inattendue : aucune donnée image (b64_json) reçue.");
  }

  const buffer = Buffer.from(b64, "base64");
  const filePath = path.join(OUTPUT_DIR, `${nom_fichier}.${OUTPUT_FORMAT}`);
  await writeFile(filePath, buffer);

  const sizeKo = (buffer.length / 1024).toFixed(1);
  console.log(
    `✅ Écrit : ${path.relative(process.cwd(), filePath)}  (${sizeKo} Ko)`,
  );
  return filePath;
}

async function main() {
  if (!existsSync(OUTPUT_DIR)) {
    await mkdir(OUTPUT_DIR, { recursive: true });
    console.log(`📁 Dossier créé : ${path.relative(process.cwd(), OUTPUT_DIR)}`);
  }

  const MAX_RETRIES = 3;
  let ok = 0;
  for (const img of IMAGES) {
    let done = false;
    for (let attempt = 1; attempt <= MAX_RETRIES && !done; attempt++) {
      try {
        await generateOne(img);
        ok += 1;
        done = true;
      } catch (err) {
        const retriable =
          /fetch failed|terminated|network|ECONNRESET|ETIMEDOUT|UND_ERR|socket/i.test(
            err.message,
          );
        if (attempt < MAX_RETRIES && retriable) {
          console.warn(
            `  ↻ ${img.nom_fichier} : ${err.message} — nouvelle tentative (${attempt + 1}/${MAX_RETRIES})…`,
          );
          await new Promise((r) => setTimeout(r, 2000));
        } else {
          console.error(`❌ ${img.nom_fichier} : ${err.message}`);
        }
      }
    }
  }

  console.log(`\nTerminé : ${ok}/${IMAGES.length} image(s) générée(s).`);
  if (ok < IMAGES.length) process.exit(1);
}

main();
