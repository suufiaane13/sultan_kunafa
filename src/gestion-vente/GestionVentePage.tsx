import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { BarChart3, Plus, Trash2, ArrowLeft, Calendar, Banknote, X, Filter, TrendingUp, ChevronDown, FileSpreadsheet, FileText } from "lucide-react";
import { getVentes, addVente, deleteVente } from "./storage";
import { Toast } from "@/components/Toast";
import type { VenteJour } from "./types";

const PAGE_SIZE = 10;
type HistoryFilter = "all" | "month" | "week";

function formatDate(s: string): string {
  const d = new Date(s + "T12:00:00");
  return d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

function getMonthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function getWeekStart(d: Date): Date {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.getFullYear(), d.getMonth(), diff);
}

function isSameWeek(dateStr: string, ref: Date): boolean {
  const d = new Date(dateStr + "T12:00:00");
  const a = getWeekStart(d);
  const b = getWeekStart(ref);
  return a.getTime() === b.getTime();
}

function getToday() {
  const d = new Date();
  return {
    day: d.getDate(),
    month: d.getMonth() + 1,
    year: d.getFullYear(),
  };
}

function toDateString(day: number, month: number, year: number): string {
  const m = String(month).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

function daysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

function formatDerniereVente(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  d.setHours(12, 0, 0, 0);
  const diffDays = Math.floor((today.getTime() - d.getTime()) / (24 * 60 * 60 * 1000));
  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} j`;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

/** Parse "JJ/MM/AAAA" → "YYYY-MM-DD" ou null si invalide */
function parseSearchDate(input: string): string | null {
  const trimmed = input.trim().replace(/\s/g, "");
  const match = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;
  const [, j, m, a] = match;
  const day = parseInt(j!, 10);
  const month = parseInt(m!, 10);
  const year = parseInt(a!, 10);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const maxDay = new Date(year, month, 0).getDate();
  if (day > maxDay) return null;
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

export function GestionVentePage() {
  const [ventes, setVentes] = useState<VenteJour[]>([]);
  const today = getToday();
  const [day, setDay] = useState(today.day);
  const [month, setMonth] = useState(today.month);
  const [year, setYear] = useState(today.year);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>("all");
  const [historyPage, setHistoryPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchDateInput, setSearchDateInput] = useState("");

  const filterOptions: { value: HistoryFilter; label: string }[] = [
    { value: "all", label: "Tous les mois" },
    { value: "month", label: "Mois en cours" },
    { value: "week", label: "Semaine en cours" },
  ];
  const currentFilterLabel = filterOptions.find((o) => o.value === historyFilter)?.label ?? "Tous les mois";
  const exportLabel = parseSearchDate(searchDateInput) ? `Date ${searchDateInput.trim()}` : currentFilterLabel;

  const load = () => setVentes(getVentes());

  useEffect(() => {
    load();
  }, []);

  const now = new Date();
  const monthKey = getMonthKey(now);
  const stats = useMemo(() => {
    let totalMois = 0;
    let nbVentesMois = 0;
    for (const v of ventes) {
      if (getMonthKey(new Date(v.date + "T12:00:00")) === monthKey) {
        totalMois += v.amount;
        nbVentesMois += 1;
      }
    }
    const derniere = ventes[0] ?? null;
    return {
      totalMois,
      nbVentesMois,
      derniereVente: derniere
        ? { label: formatDerniereVente(derniere.date), amount: derniere.amount }
        : null,
    };
  }, [ventes, monthKey]);

  const filteredVentes = useMemo(() => {
    const searchDate = parseSearchDate(searchDateInput);
    if (searchDate) {
      return ventes.filter((v) => v.date === searchDate);
    }
    if (historyFilter === "month") {
      return ventes.filter((v) => getMonthKey(new Date(v.date + "T12:00:00")) === monthKey);
    }
    if (historyFilter === "week") {
      return ventes.filter((v) => isSameWeek(v.date, now));
    }
    return ventes;
  }, [ventes, historyFilter, monthKey, now, searchDateInput]);

  const paginatedVentes = useMemo(() => {
    const start = (historyPage - 1) * PAGE_SIZE;
    return filteredVentes.slice(0, start + PAGE_SIZE);
  }, [filteredVentes, historyPage]);

  const hasMore = filteredVentes.length > paginatedVentes.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = parseFloat(amount.replace(",", "."));
    if (isNaN(n) || n < 0) return;
    const d = Math.min(day, daysInMonth(month, year));
    addVente({
      date: toDateString(d, month, year),
      amount: Math.round(n * 100) / 100,
      note: note.trim() || undefined,
    });
    setAmount("");
    setNote("");
    const t = getToday();
    setDay(t.day);
    setMonth(t.month);
    setYear(t.year);
    setFormOpen(false);
    load();
    setToastMessage("Vente enregistrée");
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      deleteVente(deleteConfirmId);
      setDeleteConfirmId(null);
      load();
      setToastMessage("Vente supprimée");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)] dark:bg-[var(--color-cream)]">
      <header className="border-b border-gold/20 bg-[var(--color-inverse-bg)] py-4 text-[var(--color-on-inverse)] sm:py-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 text-sm text-[var(--color-on-inverse)]/80 transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Retour</span>
          </Link>
          <h1 className="font-display flex min-w-0 flex-1 items-center justify-center gap-2 text-center text-lg font-semibold sm:text-xl md:text-2xl">
            <BarChart3 className="h-5 w-5 shrink-0 text-gold sm:h-6 sm:w-6" aria-hidden />
            <span className="truncate">Gestion des ventes</span>
          </h1>
          <span className="w-14 shrink-0 sm:w-20" aria-hidden />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* 3 stats — Dernière vente 1/1, CA + Ventes 2/2 */}
        <div className="mb-6 overflow-hidden rounded-xl border border-gold/20 bg-[var(--color-cream)] dark:border-gold/30 dark:bg-[var(--color-cream-dark)]">
          <div className="flex min-w-0 flex-col items-center justify-center border-b border-gold/20 px-4 py-4 text-center">
            <p className="text-xs font-medium text-gold dark:text-gold-light">Dernière vente</p>
            <p className="mt-0.5 min-w-0 font-display text-base font-semibold text-dark dark:text-dark sm:text-lg">
              {stats.derniereVente
                ? `${stats.derniereVente.label} · ${stats.derniereVente.amount.toFixed(2)} DH`
                : "—"}
            </p>
          </div>
          <div className="grid grid-cols-2 divide-x divide-gold/20">
            <div className="flex min-w-0 flex-col items-center justify-center px-4 py-4 text-center">
              <p className="text-xs font-medium text-gold dark:text-gold-light">CA du mois</p>
              <p className="mt-0.5 font-display text-base font-semibold tabular-nums text-dark dark:text-dark sm:text-lg">{stats.totalMois.toFixed(2)} DH</p>
            </div>
            <div className="flex min-w-0 flex-col items-center justify-center px-4 py-4 text-center">
              <p className="text-xs font-medium text-gold dark:text-gold-light">Ventes ce mois</p>
              <p className="mt-0.5 font-display text-base font-semibold tabular-nums text-dark dark:text-dark sm:text-lg">{stats.nbVentesMois}</p>
            </div>
          </div>
        </div>

        {/* Bouton Nouvelle vente */}
        <section className="mb-8">
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-gold/30 bg-[var(--color-surface)] px-6 py-4 shadow-[var(--shadow-card)] transition-all duration-200 hover:border-gold/50 hover:shadow-[var(--shadow-card-hover)] hover:bg-gold/5 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-[var(--color-cream)] dark:border-gold/40 dark:hover:border-gold/60 dark:hover:bg-gold/10"
            aria-expanded={formOpen}
            aria-haspopup="dialog"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-gold dark:bg-gold/25">
              <Plus className="h-5 w-5" aria-hidden />
            </span>
            <span className="font-display text-base font-semibold text-dark dark:text-dark">Nouvelle vente</span>
          </button>
        </section>

        {/* Modal formulaire */}
        {formOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md"
              aria-hidden
              onClick={() => setFormOpen(false)}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="form-title"
              className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-gold/25 bg-[var(--color-surface)] p-6 shadow-[0_25px_50px_-12px_rgba(15,8,4,0.25)] dark:border-gold/35"
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 id="form-title" className="font-display text-lg font-semibold text-dark dark:text-dark flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/15 text-gold">
                    <Banknote className="h-4 w-4" aria-hidden />
                  </span>
                  Nouvelle vente
                </h2>
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="rounded-lg p-2 text-dark/60 hover:bg-gold/10 hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
                  aria-label="Fermer"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-3 gap-3">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-dark/70 dark:text-dark-muted flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-gold" aria-hidden /> Jour
                    </span>
                    <input
                      type="number"
                      min={1}
                      max={31}
                      value={day}
                      onChange={(e) => setDay(Math.max(1, Math.min(31, parseInt(e.target.value, 10) || 1)))}
                      className="rounded-lg border border-gold/30 bg-[var(--color-cream)] px-3 py-2.5 text-sm text-dark tabular-nums transition focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 dark:border-gold/40 dark:bg-cream-dark"
                      required
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-dark/70 dark:text-dark-muted">Mois</span>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={month}
                      onChange={(e) => {
                        const m = Math.max(1, Math.min(12, parseInt(e.target.value, 10) || 1));
                        setMonth(m);
                        setDay((d) => Math.min(d, daysInMonth(m, year)));
                      }}
                      className="rounded-lg border border-gold/30 bg-[var(--color-cream)] px-3 py-2.5 text-sm text-dark tabular-nums transition focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 dark:border-gold/40 dark:bg-cream-dark"
                      required
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-dark/70 dark:text-dark-muted">Année</span>
                    <input
                      type="number"
                      min={2020}
                      max={2030}
                      value={year}
                      onChange={(e) => {
                        const y = Math.max(2020, Math.min(2030, parseInt(e.target.value, 10) || new Date().getFullYear()));
                        setYear(y);
                        setDay((d) => Math.min(d, daysInMonth(month, y)));
                      }}
                      className="rounded-lg border border-gold/30 bg-[var(--color-cream)] px-3 py-2.5 text-sm text-dark tabular-nums transition focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 dark:border-gold/40 dark:bg-cream-dark"
                      required
                    />
                  </label>
                </div>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-dark/70 dark:text-dark-muted flex items-center gap-1">
                    <Banknote className="h-3.5 w-3.5 text-gold" aria-hidden /> Montant (DH)
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0,00"
                    className="rounded-lg border border-gold/30 bg-[var(--color-cream)] px-3 py-2.5 text-sm text-dark placeholder:text-dark/40 transition focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 dark:border-gold/40 dark:bg-cream-dark"
                    required
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-dark/70 dark:text-dark-muted">Note (optionnel)</span>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ex. événement, type de vente..."
                    className="rounded-lg border border-gold/30 bg-[var(--color-cream)] px-3 py-2.5 text-sm text-dark placeholder:text-dark/40 transition focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 dark:border-gold/40 dark:bg-cream-dark"
                  />
                </label>
                <div className="mt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setFormOpen(false)}
                    className="flex-1 rounded-lg border border-gold/30 bg-transparent px-4 py-2.5 text-sm font-medium text-dark transition hover:bg-gold/10 focus:outline-none focus:ring-2 focus:ring-gold/30 dark:text-dark-muted dark:hover:bg-gold/15"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-gold-light focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-[var(--color-surface)]"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </>
        )}

        {/* Liste avec filtre et pagination */}
        <section>
          <h2 className="font-display mb-4 text-sm font-semibold text-dark/70 dark:text-dark-muted">
            Historique
          </h2>
          {ventes.length > 0 && (
            <div className="mb-4 grid grid-cols-2 gap-3 rounded-xl border border-gold/20 bg-[var(--color-cream)] p-4 shadow-[var(--shadow-card)] dark:border-gold/30 dark:bg-[var(--color-cream-dark)] md:grid-cols-1">
              {/* Mobile/tablet: col 1 = Date | col 2 = Période. Web (md+): 1 col empilée, labels à gauche, contrôles à droite */}
              <p className="col-span-2 mb-1 text-xs font-medium uppercase tracking-wide text-gold dark:text-gold-light md:col-span-1">
                Filtrer par
              </p>
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                <label htmlFor="search-date" className="text-xs font-medium text-gold dark:text-gold-light md:w-36">
                  Date :
                </label>
                <input
                  id="search-date"
                  type="text"
                  inputMode="numeric"
                  placeholder="JJ/MM/AAAA"
                  value={searchDateInput}
                  onChange={(e) => {
                    setSearchDateInput(e.target.value);
                    setHistoryPage(1);
                  }}
                  className="w-full max-w-[10rem] rounded-lg border border-gold/30 bg-[var(--color-surface)] px-3 py-2 text-sm tabular-nums text-dark placeholder:text-dark/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 dark:border-gold/40 dark:bg-cream-dark dark:text-dark-muted dark:placeholder:text-dark-muted/60 md:max-w-xs"
                  aria-label="Filtrer par date (JJ/MM/AAAA)"
                />
              </div>
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                <span className="flex items-center gap-2 text-xs font-medium text-gold dark:text-gold-light md:w-36">
                  <Filter className="h-3.5 w-3.5" aria-hidden />
                  Période :
                </span>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setFilterOpen((o) => !o)}
                    className="flex w-full min-w-0 items-center justify-between gap-2 rounded-lg border border-gold/30 bg-[var(--color-surface)] px-3 py-2 text-left text-sm font-medium text-dark focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 dark:border-gold/40 dark:bg-cream-dark dark:text-dark-muted md:min-w-[10rem] md:w-auto"
                    aria-haspopup="listbox"
                    aria-expanded={filterOpen}
                    aria-label="Filtrer l'historique"
                    id="history-filter"
                  >
                    <span className="truncate">{currentFilterLabel}</span>
                    <ChevronDown className={`h-4 w-4 shrink-0 text-gold/80 transition-transform dark:text-gold-light/90 ${filterOpen ? "rotate-180" : ""}`} strokeWidth={2.5} aria-hidden />
                  </button>
                  {filterOpen && (
                    <>
                      <div className="fixed inset-0 z-10" aria-hidden onClick={() => setFilterOpen(false)} />
                      <ul
                        role="listbox"
                        className="absolute left-0 top-full z-20 mt-1 min-w-[10rem] rounded-lg border border-gold/25 bg-[var(--color-cream)] py-1 shadow-lg dark:border-gold/35 dark:bg-[var(--color-cream-dark)]"
                        aria-labelledby="history-filter"
                      >
                        {filterOptions.map((opt) => (
                          <li key={opt.value} role="option" aria-selected={historyFilter === opt.value}>
                            <button
                              type="button"
                              onClick={() => {
                                setHistoryFilter(opt.value);
                                setHistoryPage(1);
                                setFilterOpen(false);
                              }}
                              className={`w-full px-3 py-2 text-left text-sm transition hover:bg-gold/10 dark:hover:bg-gold/15 ${historyFilter === opt.value ? "font-medium text-gold" : "text-dark dark:text-dark-muted"}`}
                            >
                              {opt.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
              {/* Excel + PDF : mobile/tablet = pleine largeur en bas (col-span-2) ; web = sous Période */}
              <div className="col-span-2 flex flex-wrap items-center justify-center gap-2 border-t border-gold/20 pt-3 md:col-span-1 md:justify-start">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const { exportToExcel } = await import("./export");
                      exportToExcel(filteredVentes, exportLabel);
                      setToastMessage("Export Excel téléchargé");
                    } catch (e) {
                      setToastMessage("Export impossible. Lancez « npm install ».");
                    }
                  }}
                  className="flex items-center gap-1.5 rounded-lg border border-gold/30 bg-[var(--color-surface)] px-3 py-2 text-sm font-medium text-dark transition hover:bg-gold/10 focus:outline-none focus:ring-2 focus:ring-gold/30 dark:border-gold/40 dark:bg-cream-dark dark:text-dark-muted dark:hover:bg-gold/15"
                  title="Exporter en Excel"
                >
                  <FileSpreadsheet className="h-4 w-4 text-green-600" aria-hidden />
                  Excel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const { exportToPdf } = await import("./export");
                      exportToPdf(filteredVentes, exportLabel);
                      setToastMessage("Export PDF téléchargé");
                    } catch (e) {
                      setToastMessage("Export impossible. Lancez « npm install ».");
                    }
                  }}
                  className="flex items-center gap-1.5 rounded-lg border border-gold/30 bg-[var(--color-surface)] px-3 py-2 text-sm font-medium text-dark transition hover:bg-gold/10 focus:outline-none focus:ring-2 focus:ring-gold/30 dark:border-gold/40 dark:bg-cream-dark dark:text-dark-muted dark:hover:bg-gold/15"
                  title="Exporter en PDF"
                >
                  <FileText className="h-4 w-4 text-red-600" aria-hidden />
                  PDF
                </button>
              </div>
            </div>
          )}
          {filteredVentes.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-gold/30 bg-gold/5 py-12 px-4 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold dark:bg-gold/25">
                <TrendingUp className="h-7 w-7" aria-hidden />
              </span>
              <div className="space-y-1">
                <p className="font-display text-sm font-medium text-dark dark:text-dark">
                  Aucune vente pour le moment
                </p>
                <p className="text-sm text-dark/60 dark:text-dark-muted max-w-xs">
                  Cliquez sur <strong>Nouvelle vente</strong> pour enregistrer votre première entrée.
                </p>
              </div>
            </div>
          ) : (
            <>
              <ul className="space-y-2">
                {paginatedVentes.map((v) => (
                  <li
                    key={v.id}
                    className="flex flex-col gap-1 rounded-xl border border-gold/20 bg-[var(--color-surface)] px-3 py-2.5 shadow-[var(--shadow-card)] dark:border-gold/30 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-4 sm:py-3"
                  >
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium text-dark dark:text-dark">{formatDate(v.date)}</p>
                        <div className="flex shrink-0 items-center gap-1">
                          <span className="font-display text-base font-semibold tabular-nums text-gold sm:text-lg">{v.amount.toFixed(2)} DH</span>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(v.id)}
                            className="rounded-lg p-1.5 text-dark/50 hover:bg-red-500/10 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-gold/30"
                            aria-label="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden />
                          </button>
                        </div>
                      </div>
                      {v.note && <p className="truncate text-xs text-dark/60 dark:text-dark-muted" title={v.note}>{v.note}</p>}
                    </div>
                  </li>
                ))}
              </ul>
              {hasMore && (
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setHistoryPage((p) => p + 1)}
                    className="rounded-lg border border-gold/30 bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-dark transition hover:bg-gold/10 focus:outline-none focus:ring-2 focus:ring-gold/30 dark:border-gold/40 dark:hover:bg-gold/15 dark:text-dark-muted"
                  >
                    Voir plus ({filteredVentes.length - paginatedVentes.length} restante{filteredVentes.length - paginatedVentes.length !== 1 ? "s" : ""})
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* Modal confirmation suppression */}
        {deleteConfirmId && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md"
              aria-hidden
              onClick={() => setDeleteConfirmId(null)}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-title"
              className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-gold/25 bg-[var(--color-surface)] p-6 shadow-[0_25px_50px_-12px_rgba(15,8,4,0.25)] dark:border-gold/35"
            >
              <h2 id="delete-title" className="font-display mb-2 text-lg font-semibold text-dark dark:text-dark">
                Supprimer cette vente ?
              </h2>
              <p className="mb-6 text-sm text-dark/70 dark:text-dark-muted">
                Cette action est irréversible.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 rounded-lg border border-gold/30 bg-transparent px-4 py-2.5 text-sm font-medium text-dark transition hover:bg-gold/10 focus:outline-none focus:ring-2 focus:ring-gold/30 dark:text-dark-muted dark:hover:bg-gold/15"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[var(--color-surface)]"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </>
        )}

        <Toast
          message={toastMessage ?? ""}
          visible={!!toastMessage}
          onClose={() => setToastMessage(null)}
        />
      </main>
    </div>
  );
}
