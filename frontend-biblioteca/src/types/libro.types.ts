export type Libro = {
  id: number;
  titolo: string;
  autore: string;
  genere?: string | null;
  descrizione?: string | null;
  copieTotali: number;
  copieDisponibili: number;
  createdAt: string;
  updatedAt: string;
};
