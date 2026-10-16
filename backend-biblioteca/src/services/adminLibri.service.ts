import prisma from "../config/prisma";

type LibroInput = {
  titolo?: string;
  autore?: string;
  genere?: string | null;
  descrizione?: string | null;
  copieTotali?: number;
};

const pulisci = (valore?: string | null) => {
  const testo = valore?.trim();
  return testo ? testo : null;
};

const validaCopie = (valore: unknown): number => {
  const numero = Number(valore);
  if (!Number.isInteger(numero) || numero < 0) {
    throw new Error("Le copie totali devono essere un numero intero >= 0");
  }
  return numero;
};

const validaId = (id: number) => {
  if (!Number.isInteger(id)) {
    throw new Error("ID libro non valido");
  }
};

const gestisciErrore = (error: unknown): never => {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "P2002"
  ) {
    throw new Error("Esiste già un libro con lo stesso titolo e autore");
  }
  throw error;
};

const STATI_IN_CORSO: ("ATTIVO" | "SCADUTO")[] = ["ATTIVO", "SCADUTO"];

export const getLibri = async () => {
  return prisma.libro.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const createLibro = async (data: LibroInput) => {
  const titolo = data.titolo?.trim();
  const autore = data.autore?.trim();

  if (!titolo || !autore) {
    throw new Error("Titolo e autore sono obbligatori");
  }

  const copieTotali = validaCopie(data.copieTotali ?? 1);

  try {
    return await prisma.libro.create({
      data: {
        titolo,
        autore,
        genere: pulisci(data.genere),
        descrizione: pulisci(data.descrizione),
        copieTotali,
        copieDisponibili: copieTotali, // appena creato: tutte disponibili
      },
    });
  } catch (error) {
    return gestisciErrore(error);
  }
};

export const updateLibro = async (id: number, data: LibroInput) => {
  validaId(id);

  const libro = await prisma.libro.findUnique({ where: { id } });

  if (!libro) {
    throw new Error("Libro non trovato");
  }

  const titolo = data.titolo !== undefined ? data.titolo.trim() : libro.titolo;
  const autore = data.autore !== undefined ? data.autore.trim() : libro.autore;

  if (!titolo || !autore) {
    throw new Error("Titolo e autore sono obbligatori");
  }

  const inCorso = await prisma.noleggio.count({
    where: { libroId: id, stato: { in: STATI_IN_CORSO } },
  });

  const copieTotali =
    data.copieTotali !== undefined
      ? validaCopie(data.copieTotali)
      : libro.copieTotali;

  if (copieTotali < inCorso) {
    throw new Error(
      `Non puoi impostare meno di ${inCorso} copie totali: ci sono noleggi in corso`,
    );
  }

  // Le disponibili seguono la variazione delle totali
  const differenza = copieTotali - libro.copieTotali;

  try {
    return await prisma.libro.update({
      where: { id },
      data: {
        titolo,
        autore,
        genere:
          data.genere !== undefined ? pulisci(data.genere) : libro.genere,
        descrizione:
          data.descrizione !== undefined
            ? pulisci(data.descrizione)
            : libro.descrizione,
        copieTotali,
        copieDisponibili: { increment: differenza },
      },
    });
  } catch (error) {
    return gestisciErrore(error);
  }
};

export const deleteLibro = async (id: number) => {
  validaId(id);

  const libro = await prisma.libro.findUnique({ where: { id } });

  if (!libro) {
    throw new Error("Libro non trovato");
  }

  const inCorso = await prisma.noleggio.count({
    where: { libroId: id, stato: { in: STATI_IN_CORSO } },
  });

  if (inCorso > 0) {
    throw new Error("Non puoi eliminare un libro con noleggi in corso");
  }

  const storico = await prisma.noleggio.count({ where: { libroId: id } });

  if (storico > 0) {
    throw new Error(
      "Non puoi eliminare un libro che ha uno storico di noleggi",
    );
  }

  await prisma.libro.delete({ where: { id } });

  return { message: "Libro eliminato con successo" };
};