/** Une entrée de vente pour un jour donné (fondateurs) */
export interface VenteJour {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number; // DH
  note?: string;
}

export type VentesStorage = VenteJour[];
