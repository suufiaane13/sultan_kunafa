/**
 * Importe des ventes depuis un fichier Excel (format FR exporté par le site).
 * Colonnes attendues : Date, Type, Montant (DH), Note.
 * Si une vente existe déjà (même date, montant, type), elle est ignorée.
 */

import * as XLSX from "xlsx";
import { getVentes, addVente } from "./storage";
import type { VenteJour, VenteType } from "./types";

const FR_MONTHS: Record<string, number> = {
  janv: 1,
  févr: 2,
  mars: 3,
  avr: 4,
  mai: 5,
  juin: 6,
  juil: 7,
  août: 8,
  sept: 9,
  oct: 10,
  nov: 11,
  déc: 12,
};

const DATE_COL = "Date";
const TYPE_COL = "Type";
const AMOUNT_COL = "Montant (DH)";
const NOTE_COL = "Note";
const TOTAL_NOTE = "Total";
const EMPTY_DATE = "Aucune vente";
const TYPE_KUNAFA = "Kunafa";
const TYPE_FLAN = "Flan et autre";

/** Parse une date au format FR exporté (ex. "ven. 28 févr. 2025") → YYYY-MM-DD ou null */
function parseFrenchDate(str: string): string | null {
  if (!str || typeof str !== "string") return null;
  const s = str.trim();
  // Format: "lun. 3 mars 2025" ou "ven. 28 févr. 2025"
  const parts = s.split(/\s+/);
  if (parts.length < 4) return null;
  const day = parseInt(parts[1], 10);
  const year = parseInt(parts[3], 10);
  const monthStr = parts[2].replace(/\.$/, "").toLowerCase();
  const monthKey = Object.keys(FR_MONTHS).find((k) => monthStr.startsWith(k) || k.startsWith(monthStr));
  const month = monthKey ? FR_MONTHS[monthKey] : undefined;
  if (!month || day < 1 || day > 31 || Number.isNaN(year) || year < 2000 || year > 2100) return null;
  const maxDay = new Date(year, month, 0).getDate();
  if (day > maxDay) return null;
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

function parseType(val: unknown): VenteType | undefined {
  if (val === TYPE_KUNAFA) return "kunafa";
  if (val === TYPE_FLAN) return "flan";
  return undefined;
}

function parseAmount(val: unknown): number | null {
  if (val === undefined || val === null || val === "") return null;
  const n = typeof val === "number" ? val : parseFloat(String(val).replace(",", "."));
  if (Number.isNaN(n) || n < 0) return null;
  return Math.round(n * 100) / 100;
}

/** Vérifie si une vente équivalente existe déjà */
function exists(ventes: VenteJour[], date: string, amount: number, type: VenteType | undefined): boolean {
  return ventes.some(
    (v) =>
      v.date === date &&
      v.amount === amount &&
      (v.type ?? undefined) === (type ?? undefined)
  );
}

export interface ImportResult {
  imported: number;
  skipped: number;
}

/**
 * Lit le fichier Excel (format FR) et ajoute les ventes qui n'existent pas déjà.
 */
export async function importFromExcel(file: File): Promise<ImportResult> {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: "array" });
  const firstSheet = wb.Sheets[wb.SheetNames[0]];
  if (!firstSheet) return { imported: 0, skipped: 0 };

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, { defval: "" });
  const existing = getVentes();
  let imported = 0;
  let skipped = 0;

  for (const row of rows) {
    const dateStr = row[DATE_COL] != null ? String(row[DATE_COL]).trim() : "";
    const noteVal = row[NOTE_COL];
    const noteStr = noteVal != null ? String(noteVal).trim() : "";

    // Ligne Total ou vide
    if (noteStr === TOTAL_NOTE || dateStr === EMPTY_DATE) continue;
    const date = parseFrenchDate(dateStr);
    if (!date) continue;

    const amount = parseAmount(row[AMOUNT_COL]);
    if (amount === null) continue;

    const type = parseType(row[TYPE_COL]);

    if (exists(existing, date, amount, type)) {
      skipped += 1;
      continue;
    }

    addVente({ date, amount, type, note: noteStr || undefined });
    existing.push({ id: "", date, amount, type, note: noteStr || undefined });
    imported += 1;
  }

  return { imported, skipped };
}
