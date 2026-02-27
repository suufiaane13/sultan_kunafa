/**
 * Génère un QR code pour le profil Instagram (logo Instagram or au centre).
 * Usage: npm run qr:instagram   (ou: node scripts/generate-qr-instagram.js)
 * Sortie: public/qr-instagram.svg, public/qr-instagram.png (si sharp)
 */

import { createRequire } from "module";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const require = createRequire(import.meta.url);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const publicDir = path.join(rootDir, "public");
const logoPath = path.join(publicDir, "instagram-logo-gold.svg");

const INSTAGRAM_URL = "https://www.instagram.com/sultan_kunafa48/";
const DEBUG = process.env.DEBUG !== "0" && process.env.DEBUG !== "false";
const log = (...args) => DEBUG && console.log("[qr-instagram]", ...args);
const debug = (...args) => DEBUG && console.debug("[qr-instagram:debug]", ...args);

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
  const ext = path.extname(logoPath).toLowerCase();
  const mime = ext === ".svg" ? "image/svg+xml" : "image/png";
  const dataUrl = `data:${mime};base64,${buf.toString("base64")}`;
  log("logo chargé, taille base64:", Math.round(dataUrl.length / 1024), "Ko");
  return dataUrl;
}

function getQROptions(extra = {}) {
  const image = getLogoDataUrl();
  return {
    width: 800,
    height: 800,
    data: INSTAGRAM_URL,
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
  log("démarrage — URL:", INSTAGRAM_URL);
  log("publicDir:", publicDir);

  const { JSDOM } = await import("jsdom");
  const QRCodeStyling = require("qr-code-styling").default ?? require("qr-code-styling");

  const svgPath = path.join(publicDir, "qr-instagram.svg");
  const pngPath = path.join(publicDir, "qr-instagram.png");
  debug("sorties:", { svgPath, pngPath });

  log("génération SVG...");
  const qrSvg = new QRCodeStyling({
    ...getQROptions(),
    type: "svg",
    jsdom: JSDOM,
  });
  const svgBuffer = await qrSvg.getRawData("svg");
  if (svgBuffer) {
    const out = Buffer.isBuffer(svgBuffer) ? svgBuffer : Buffer.from(await svgBuffer.arrayBuffer());
    fs.writeFileSync(svgPath, out);
    log("✓ QR code SVG:", svgPath, "(", out.length, "octets)");
  } else {
    log("⚠ pas de buffer SVG");
  }

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

  log("terminé — URL encodée:", INSTAGRAM_URL);
}

main().catch((err) => {
  console.error("[qr-instagram] erreur:", err);
  if (DEBUG) console.error(err.stack);
  process.exit(1);
});
