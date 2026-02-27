/** Type de vente */
export type VenteType = "kunafa" | "flan";

/** Une entrée de vente pour un jour donné (fondateurs) */
export interface VenteJour {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number; // DH
  type?: VenteType; // kunafa | flan
  note?: string;
}

export type VentesStorage = VenteJour[];
