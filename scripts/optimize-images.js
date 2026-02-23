/**
 * Optimise les images du dossier public pour la production.
 * Usage: npm run optimize-images  (ou automatique avant npm run build)
 *
 * - Redimensionne à max 1200px (côté le plus long)
 * - Compresse PNG (niveau 9) et JPEG (qualité 85)
 * - Génère des .webp à côté de chaque image (le site les utilise si présents)
 *
 * Attention: écrase les fichiers originaux dans public/. Sauvegardez les originaux si besoin.
 * Dépendance: sharp (déjà dans le projet)
 */

import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const publicDir = path.join(rootDir, "public");

const MAX_WIDTH = 1200;
const QUALITY = 85;
const WEBP_QUALITY = 82;
/** Tailles responsives pour les photos du menu (dossier photos/) — srcset en production */
const RESPONSIVE_WIDTHS = [400, 800];

const EXT = [".png", ".jpg", ".jpeg"];
const SKIP = ["qr-menu.png", "qr-menu.svg"]; // générés par script, ne pas écraser

function getAllImagePaths(dir, list = []) {
  if (!fs.existsSync(dir)) return list;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      getAllImagePaths(full, list);
    } else if (EXT.some((ext) => e.name.toLowerCase().endsWith(ext))) {
      if (!SKIP.some((s) => e.name === s)) list.push(full);
    }
  }
  return list;
}

async function optimizeOne(inputPath) {
  const sharp = (await import("sharp")).default;
  const rel = path.relative(publicDir, inputPath);
  const ext = path.extname(inputPath).toLowerCase();
  const isPng = ext === ".png";

  try {
    let img = sharp(inputPath);
    const meta = await img.metadata();
    const w = meta.width ?? 0;
    const h = meta.height ?? 0;
    const needResize = w > MAX_WIDTH || h > MAX_WIDTH;

    if (needResize) {
      img = img.resize(MAX_WIDTH, MAX_WIDTH, { fit: "inside", withoutEnlargement: true });
    }

    let pipeline = needResize ? img : sharp(inputPath);
    const tmpPath = inputPath + ".tmp";

    if (isPng) {
      await pipeline.png({ compressionLevel: 9 }).toFile(tmpPath);
    } else {
      await pipeline.jpeg({ quality: QUALITY, mozjpeg: true }).toFile(tmpPath);
    }
    fs.renameSync(tmpPath, inputPath);

    // Générer WebP à côté (même nom .webp)
    const basePath = inputPath.slice(0, -path.extname(inputPath).length);
    const webpPath = basePath + ".webp";
    await sharp(inputPath).webp({ quality: WEBP_QUALITY }).toFile(webpPath);

    // Pour les images dans photos/, générer aussi des WebP responsives (400w, 800w) pour srcset
    const isInPhotos = path.relative(publicDir, inputPath).startsWith("photos" + path.sep);
    if (isInPhotos) {
      for (const w of RESPONSIVE_WIDTHS) {
        const outPath = `${basePath}-${w}.webp`;
        await sharp(inputPath)
          .resize(w, w, { fit: "inside", withoutEnlargement: true })
          .webp({ quality: WEBP_QUALITY })
          .toFile(outPath);
      }
    }

    const statWebp = fs.statSync(webpPath);
    console.log(`  ✓ ${rel} (opti + WebP: ${(statWebp.size / 1024).toFixed(1)} Ko)`);
    return { path: inputPath, webpPath };
  } catch (err) {
    console.warn(`  ✗ ${rel}:`, err.message);
    return null;
  }
}

async function main() {
  console.log("[optimize-images] public dir:", publicDir);
  const files = getAllImagePaths(publicDir);
  if (files.length === 0) {
    console.log("  Aucune image à optimiser.");
    return;
  }
  console.log(`  ${files.length} image(s) à traiter…`);

  for (const f of files) {
    await optimizeOne(f);
  }

  console.log("[optimize-images] terminé.");
}

main().catch((err) => {
  console.error("[optimize-images] erreur:", err);
  process.exit(1);
});
