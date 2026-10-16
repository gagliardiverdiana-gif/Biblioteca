export type AdminNoleggio = {
  id: number;
  dataNoleggio: string;
  dataScadenza: string;
  dataRestituzione?: string | null;
  stato: "ATTIVO" | "RESTITUITO" | "SCADUTO";
  utente: {
    id: number;
    nomeCompleto: string;
    email: string;
    ruolo: string;
  };
  libro: {
    id: number;
    titolo: string;
    autore: string;
  };
};
