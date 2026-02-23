/**
 * Génère un QR code professionnel pour la page Menu.
 * Usage: npm run qr   (ou: node scripts/generate-qr-menu.js)
 * Sortie: public/qr-menu.svg (toujours), public/qr-menu.png (si canvas installé)
 *
 * Dépendances: npm install (qr-code-styling, jsdom, sharp pour PNG)
 */

import { createRequire } from "module";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const publicDir = path.join(rootDir, "public");
const logoPath = path.join(publicDir, "logo+.png");

const MENU_URL = "https://sultan-kunafa.netlify.app/menu";
const DEBUG = process.env.DEBUG !== "0" && process.env.DEBUG !== "false";
const log = (...args) => DEBUG && console.log("[qr]", ...args);
const debug = (...args) => DEBUG && console.debug("[qr:debug]", ...args);

const colors = {
  dark: "#0f0804",
  cream: "#faf6f1",
  gold: "#c99b2d",
};

function getLogoDataUrl() {
  const exists = fs.existsSync(logoPath);
  debug("logo path:", logoPath, "exists:", exists);
  if (!exists) return undefined;
  const buf = fs.readFileSync(logoPath);
  const dataUrl = `data:image/png;base64,${buf.toString("base64")}`;
  log("logo chargé, taille base64:", Math.round(dataUrl.length / 1024), "Ko");
  return dataUrl;
}

function getQROptions(extra = {}) {
  const image = getLogoDataUrl();
  return {
    width: 800,
    height: 800,
    data: MENU_URL,
    margin: 40,
    qrOptions: { typeNumber: 0, mode: "Byte", errorCorrectionLevel: "H" },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.4,
      margin: 8,
      saveAsBlob: true,
    },
    dotsOptions: { color: colors.dark, type: "rounded" },
    cornersSquareOptions: { color: colors.dark, type: "extra-rounded" },
    cornersDotOptions: { color: colors.gold, type: "dot" },
    backgroundOptions: { color: colors.cream, round: 0 },
    ...(image && { image }),
    ...extra,
  };
}

async function main() {
  log("démarrage — URL:", MENU_URL);
  log("publicDir:", publicDir);

  debug("import jsdom...");
  const { JSDOM } = await import("jsdom");
  debug("import qr-code-styling...");
  const QRCodeStyling = require("qr-code-styling").default ?? require("qr-code-styling");

  const svgPath = path.join(publicDir, "qr-menu.svg");
  const pngPath = path.join(publicDir, "qr-menu.png");
  debug("sorties:", { svgPath, pngPath });

  // SVG (toujours)
  log("génération SVG...");
  const qrSvg = new QRCodeStyling({
    ...getQROptions(),
    type: "svg",
    jsdom: JSDOM,
  });
  const svgBuffer = await qrSvg.getRawData("svg");
  debug("getRawData(svg) ok, type:", typeof svgBuffer, Buffer.isBuffer(svgBuffer) ? "Buffer" : "Blob");
  if (svgBuffer) {
    const out = Buffer.isBuffer(svgBuffer) ? svgBuffer : Buffer.from(await svgBuffer.arrayBuffer());
    fs.writeFileSync(svgPath, out);
    log("✓ QR code SVG:", svgPath, "(", out.length, "octets)");
  } else {
    log("⚠ pas de buffer SVG");
  }

  // PNG : conversion SVG → PNG (le SVG contient déjà le logo)
  log("génération PNG à partir du SVG...");
  try {
    const sharp = (await import("sharp")).default;
    await sharp(svgPath)
      .resize(800, 800)
      .png()
      .toFile(pngPath);
    const stat = fs.statSync(pngPath);
    log("✓ QR code PNG:", pngPath, "(", stat.size, "octets)");
  } catch (e) {
    debug("sharp/PNG erreur:", e.message || e);
    console.log("  (PNG: installez 'sharp' avec npm install sharp --save-dev)");
  }

  log("terminé — URL encodée:", MENU_URL);
}

main().catch((err) => {
  console.error("[qr] erreur:", err);
  if (DEBUG) console.error(err.stack);
  process.exit(1);
});
