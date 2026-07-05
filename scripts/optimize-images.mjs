// Optimise les .webp de public/photos/ : sauvegarde les originaux dans
// public/photos/_originals/, puis redimensionne + recompresse chaque image
// selon son usage réel (cible < 200 Ko, qualité visuelle préservée).
//
// Usage : node scripts/optimize-images.mjs   (ou npm run optimize-images)

import sharp from "sharp";
import { mkdir, readdir, copyFile, writeFile, stat } from "node:fs/promises";
import path from "node:path";

const DIR = path.resolve(process.cwd(), "public", "photos");
const ORIG = path.join(DIR, "_originals");

// Largeur cible (px) par usage. Le hero est le plus grand ; les vignettes
// avant/après sont petites. `withoutEnlargement` empêche tout agrandissement.
const WIDTHS = {
  "hero-plombier-nice": 1024,
  "depannage-urgence": 900,
  "renovation-salle-de-bain": 900,
  "chauffe-eau": 900,
  "recherche-de-fuite": 900,
  "plomberie-generale": 900,
  "plomberie-piscine-villa": 900,
  "avant-renovation": 680,
  "apres-renovation": 680,
  "avant-piscine": 680,
  "apres-piscine": 680,
};
const DEFAULT_WIDTH = 900;
const QUALITY = 70; // webp
const MAX_KO = 200;

const fmt = (bytes) => (bytes / 1024).toFixed(0);

async function main() {
  await mkdir(ORIG, { recursive: true });

  // Filtre optionnel : `node scripts/optimize-images.mjs nom1 nom2` ne traite
  // que les fichiers nommés (évite d'écraser les originaux déjà sauvegardés des
  // autres images). Sans argument → toutes les .webp du dossier.
  const only = process.argv.slice(2).map((n) => n.replace(/\.webp$/, ""));
  const files = (await readdir(DIR))
    .filter((f) => f.endsWith(".webp"))
    .filter((f) => only.length === 0 || only.includes(f.replace(/\.webp$/, "")));

  console.log(`Optimisation de ${files.length} image(s)…\n`);
  console.log(
    "fichier".padEnd(32) + "avant".padStart(8) + "après".padStart(10) + "  largeur",
  );
  console.log("-".repeat(60));

  for (const f of files) {
    const src = path.join(DIR, f);
    const backup = path.join(ORIG, f);
    const name = f.replace(/\.webp$/, "");

    // Sauvegarde de l'original (si pas déjà fait)
    await copyFile(src, backup);
    const before = (await stat(backup)).size;

    const width = WIDTHS[name] ?? DEFAULT_WIDTH;

    // Compression, en réduisant la qualité si on dépasse la cible.
    let quality = QUALITY;
    let out;
    do {
      out = await sharp(backup)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality })
        .toBuffer();
      if (out.length / 1024 <= MAX_KO || quality <= 45) break;
      quality -= 6;
    } while (true);

    await writeFile(src, out);
    const meta = await sharp(out).metadata();
    console.log(
      f.padEnd(32) +
        `${fmt(before)}Ko`.padStart(8) +
        `${fmt(out.length)}Ko`.padStart(10) +
        `  ${meta.width}px (q${quality})`,
    );
  }

  console.log("\n✅ Terminé. Originaux conservés dans public/photos/_originals/");
}

main().catch((e) => {
  console.error("❌ Optimisation échouée :", e.message);
  process.exit(1);
});
