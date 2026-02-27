import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import type { VenteJour } from "./types";

function formatDateExport(s: string): string {
  const d = new Date(s + "T12:00:00");
  return d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

function fileName(ext: string): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `Sultan-Kunafa-Ventes-${y}-${m}-${day}.${ext}`;
}

/** Export ventes en Excel (SheetJS) — colonnes Date, Montant (DH), Note + ligne Total */
export function exportToExcel(ventes: VenteJour[], periodLabel: string): void {
  const rows: { Date: string; "Montant (DH)": number; Note: string }[] = ventes.map((v) => ({
    Date: formatDateExport(v.date),
    "Montant (DH)": v.amount,
    Note: v.note ?? "",
  }));
  const total = ventes.reduce((s, v) => s + v.amount, 0);
  if (rows.length > 0) {
    rows.push({ Date: "", "Montant (DH)": total, Note: "Total" });
  }

  const ws = XLSX.utils.json_to_sheet(rows.length ? rows : [{ Date: "Aucune vente", "Montant (DH)": "", Note: "" }]);
  const colWidths = [{ wch: 28 }, { wch: 14 }, { wch: 30 }];
  ws["!cols"] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, periodLabel.replace(/\s/g, "_").slice(0, 31));
  XLSX.writeFile(wb, fileName("xlsx"));
}

/** Export ventes en PDF (jsPDF + AutoTable) — en-tête Sultan Kunafa, tableau + total */
export function exportToPdf(ventes: VenteJour[], periodLabel: string): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const total = ventes.reduce((s, v) => s + v.amount, 0);

  doc.setFont("helvetica");
  doc.setFontSize(18);
  doc.setTextColor(40, 30, 15);
  doc.text("Sultan Kunafa", 14, 18);
  doc.setFontSize(11);
  doc.setTextColor(80, 70, 60);
  doc.text("Historique des ventes", 14, 25);
  doc.text(`${periodLabel} · Généré le ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`, 14, 31);

  const tableData = ventes.length
    ? ventes.map((v) => [formatDateExport(v.date), v.amount.toFixed(2), v.note ?? ""])
    : [["Aucune vente", "—", "—"]];

  autoTable(doc, {
    startY: 38,
    head: [["Date", "Montant (DH)", "Note"]],
    body: tableData,
    foot: ventes.length > 0 ? [["", total.toFixed(2), "Total"]] : undefined,
    theme: "striped",
    headStyles: { fillColor: [201, 155, 45], textColor: [255, 255, 255], fontStyle: "bold" },
    alternateRowStyles: { fillColor: [250, 246, 241] },
    footStyles: { fillColor: [240, 232, 223], fontStyle: "bold" },
    margin: { left: 14, right: 14 },
    columnStyles: { 0: { cellWidth: 55 }, 1: { cellWidth: 35 }, 2: { cellWidth: "auto" } },
  });

  doc.save(fileName("pdf"));
}
