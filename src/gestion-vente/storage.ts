import type { VenteJour } from "./types";

const STORAGE_KEY = "sultan-kunafa-ventes";

export function getVentes(): VenteJour[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveVentes(ventes: VenteJour[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ventes));
  } catch {
    // ignore
  }
}

export function addVente(vente: Omit<VenteJour, "id">): void {
  const ventes = getVentes();
  const id = crypto.randomUUID?.() ?? `v-${Date.now()}`;
  ventes.push({ ...vente, id });
  ventes.sort((a, b) => b.date.localeCompare(a.date));
  saveVentes(ventes);
}

export function updateVente(id: string, patch: Partial<Pick<VenteJour, "date" | "amount" | "note">>): void {
  const ventes = getVentes().map((v) => (v.id === id ? { ...v, ...patch } : v));
  ventes.sort((a, b) => b.date.localeCompare(a.date));
  saveVentes(ventes);
}

export function deleteVente(id: string): void {
  saveVentes(getVentes().filter((v) => v.id !== id));
}
