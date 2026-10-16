export type LibroNoleggio = {
  id: number;
  titolo: string;
  autore: string;
  genere?: string | null;
  descrizione?: string | null;
  copieTotali: number;
  copieDisponibili: number;
};

export type Noleggio = {
  id: number;
  utenteId: number;
  libroId: number;
  dataNoleggio: string;
  dataScadenza: string;
  dataRestituzione?: string | null;
  stato: string;
  libro: LibroNoleggio;
};

export type MovimentoFedelta = {
  id: number;
  cartaFedeltaId: number;
  noleggioId: number | null;
  punti: number;
  motivazione: string;
  dataMovimento: string;
};

export type CartaFedelta = {
  id: number;
  utenteId: number;
  puntiTotali: number;
  movimenti: MovimentoFedelta[];
};

export type MieiNoleggiResponse = {
  noleggiAttivi: Noleggio[];
  storicoNoleggi: Noleggio[];
  cartaFedelta: CartaFedelta | null;
};