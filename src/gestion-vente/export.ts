import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { t, type Locale } from "@/content/translations";
import type { VenteJour } from "./types";

function formatDateExport(s: string, locale: Locale): string {
  const d = new Date(s + "T12:00:00");
  const loc = locale === "ar" ? "ar-MA" : "fr-FR";
  return d.toLocaleDateString(loc, { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

function fileName(ext: string): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `Sultan-Kunafa-Ventes-${y}-${m}-${day}.${ext}`;
}

/** Export ventes en Excel (SheetJS) — colonnes selon la locale */
export function exportToExcel(ventes: VenteJour[], periodLabel: string, locale: Locale): void {
  const dateCol = t(locale, "gestionVente.dateShort");
  const typeCol = t(locale, "gestionVente.typeLabel");
  const amountCol = t(locale, "gestionVente.amountDh");
  const noteCol = t(locale, "gestionVente.exportNote");
  const totalLabel = t(locale, "contact.totalLabel");
  const emptyLabel = t(locale, "gestionVente.exportEmpty");
  const typeKunafa = t(locale, "gestionVente.typeKunafa");
  const typeFlan = t(locale, "gestionVente.typeFlan");

  const rows = ventes.map((v) => ({
    [dateCol]: formatDateExport(v.date, locale),
    [typeCol]: v.type ? (v.type === "kunafa" ? typeKunafa : typeFlan) : "",
    [amountCol]: v.amount,
    [noteCol]: v.note ?? "",
  }));
  const total = ventes.reduce((s, v) => s + v.amount, 0);
  if (rows.length > 0) {
    rows.push({ [dateCol]: "", [typeCol]: "", [amountCol]: total, [noteCol]: totalLabel });
  }

  const emptyRow = { [dateCol]: emptyLabel, [typeCol]: "", [amountCol]: "", [noteCol]: "" };
  const ws = XLSX.utils.json_to_sheet(rows.length ? rows : [emptyRow]);
  const colWidths = [{ wch: 28 }, { wch: 14 }, { wch: 14 }, { wch: 30 }];
  ws["!cols"] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, periodLabel.replace(/\s/g, "_").slice(0, 31));
  XLSX.writeFile(wb, fileName("xlsx"));
}

/** Export ventes en PDF (jsPDF + AutoTable) — en-tête et libellés selon la locale */
export function exportToPdf(ventes: VenteJour[], periodLabel: string, locale: Locale): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const total = ventes.reduce((s, v) => s + v.amount, 0);

  const dateCol = t(locale, "gestionVente.dateShort");
  const typeCol = t(locale, "gestionVente.typeLabel");
  const amountCol = t(locale, "gestionVente.amountDh");
  const noteCol = t(locale, "gestionVente.exportNote");
  const totalLabel = t(locale, "contact.totalLabel");
  const emptyLabel = t(locale, "gestionVente.exportEmpty");
  const historyTitle = t(locale, "gestionVente.exportHistoryTitle");
  const generatedOn = t(locale, "gestionVente.exportGeneratedOn");
  const typeKunafa = t(locale, "gestionVente.typeKunafa");
  const typeFlan = t(locale, "gestionVente.typeFlan");

  const dateLoc = locale === "ar" ? "ar-MA" : "fr-FR";
  const generatedDate = new Date().toLocaleDateString(dateLoc, { day: "numeric", month: "long", year: "numeric" });

  doc.setFont("helvetica");
  doc.setFontSize(18);
  doc.setTextColor(40, 30, 15);
  doc.text("Sultan Kunafa", 14, 18);
  doc.setFontSize(11);
  doc.setTextColor(80, 70, 60);
  doc.text(historyTitle, 14, 25);
  doc.text(`${periodLabel} · ${generatedOn} ${generatedDate}`, 14, 31);

  const tableData = ventes.length
    ? ventes.map((v) => [
        formatDateExport(v.date, locale),
        v.type ? (v.type === "kunafa" ? typeKunafa : typeFlan) : "—",
        v.amount.toFixed(2),
        v.note ?? "",
      ])
    : [[emptyLabel, "—", "—", "—"]];

  autoTable(doc, {
    startY: 38,
    head: [[dateCol, typeCol, amountCol, noteCol]],
    body: tableData,
    foot: ventes.length > 0 ? [["", "", total.toFixed(2), totalLabel]] : undefined,
    theme: "striped",
    headStyles: { fillColor: [201, 155, 45], textColor: [255, 255, 255], fontStyle: "bold" },
    alternateRowStyles: { fillColor: [250, 246, 241] },
    footStyles: { fillColor: [201, 155, 45], textColor: [255, 255, 255], fontStyle: "bold" },
    margin: { left: 14, right: 14 },
    columnStyles: { 0: { cellWidth: 45 }, 1: { cellWidth: 22 }, 2: { cellWidth: 28 }, 3: { cellWidth: "auto" } },
  });

  doc.save(fileName("pdf"));
}
