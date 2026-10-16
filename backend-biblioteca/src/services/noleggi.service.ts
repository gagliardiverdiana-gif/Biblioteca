import prisma from "../config/prisma";

type CreateNoleggioInput = {
  utenteId: number;
  libroId: number;
};

type RestituisciNoleggioInput = {
  noleggioId: number;
  utenteId: number;
};

const PUNTI_RESTITUZIONE = 10;
const GIORNI_NOLEGGIO = 14;

// Segna come SCADUTO i noleggi attivi con scadenza passata
export const aggiornaNoleggiScaduti = async () => {
  await prisma.noleggio.updateMany({
    where: {
      stato: "ATTIVO",
      dataScadenza: { lt: new Date() },
    },
    data: { stato: "SCADUTO" },
  });
};

export const createNoleggio = async ({
  utenteId,
  libroId,
}: CreateNoleggioInput) => {
  if (!Number.isInteger(libroId)) {
    throw new Error("Libro non valido");
  }

  const dataScadenza = new Date();
  dataScadenza.setDate(dataScadenza.getDate() + GIORNI_NOLEGGIO);

  return prisma.$transaction(async (tx) => {
    const libro = await tx.libro.findUnique({ where: { id: libroId } });

    if (!libro) {
      throw new Error("Libro non trovato");
    }

    // Decremento atomico: funziona solo se ci sono ancora copie
    const aggiornati = await tx.libro.updateMany({
      where: { id: libroId, copieDisponibili: { gt: 0 } },
      data: { copieDisponibili: { decrement: 1 } },
    });

    if (aggiornati.count === 0) {
      throw new Error("Nessuna copia disponibile");
    }

    return tx.noleggio.create({
      data: {
        utenteId,
        libroId,
        dataScadenza,
        stato: "ATTIVO",
      },
      select: {
        id: true,
        utenteId: true,
        libroId: true,
        dataNoleggio: true,
        dataScadenza: true,
        stato: true,
      },
    });
  });
};

export const restituisciNoleggio = async ({
  noleggioId,
  utenteId,
}: RestituisciNoleggioInput) => {
  if (!Number.isInteger(noleggioId)) {
    throw new Error("Noleggio non valido");
  }

  return prisma.$transaction(async (tx) => {
    const noleggio = await tx.noleggio.findUnique({
      where: { id: noleggioId },
    });

    if (!noleggio) {
      throw new Error("Noleggio non trovato");
    }

    if (noleggio.utenteId !== utenteId) {
      throw new Error("Non puoi restituire questo noleggio");
    }

    // Si può restituire sia un noleggio ATTIVO sia uno SCADUTO
    const aggiornati = await tx.noleggio.updateMany({
      where: {
        id: noleggioId,
        stato: { in: ["ATTIVO", "SCADUTO"] },
      },
      data: {
        stato: "RESTITUITO",
        dataRestituzione: new Date(),
      },
    });

    if (aggiornati.count === 0) {
      throw new Error("Il noleggio è già stato restituito");
    }

    await tx.libro.update({
      where: { id: noleggio.libroId },
      data: { copieDisponibili: { increment: 1 } },
    });

    // Se la carta non esiste (utenti creati a mano) viene creata
    const carta = await tx.cartaFedelta.upsert({
      where: { utenteId },
      update: { puntiTotali: { increment: PUNTI_RESTITUZIONE } },
      create: { utenteId, puntiTotali: PUNTI_RESTITUZIONE },
    });

    await tx.movimentoFedelta.create({
      data: {
        cartaFedeltaId: carta.id,
        noleggioId: noleggio.id,
        punti: PUNTI_RESTITUZIONE,
        motivazione: "Restituzione libro",
      },
    });

        const noleggioAggiornato = await tx.noleggio.findUnique({
      where: { id: noleggioId },
      select: {
        id: true,
        utenteId: true,
        libroId: true,
        dataNoleggio: true,
        dataScadenza: true,
        dataRestituzione: true,
        stato: true,
      },
    });

    return { ...noleggioAggiornato, puntiGuadagnati: PUNTI_RESTITUZIONE };
  });
};

export const getMieiNoleggi = async (utenteId: number) => {
  await aggiornaNoleggiScaduti();

  // "Attivi" = non ancora restituiti (quindi anche quelli scaduti)
  const noleggiAttivi = await prisma.noleggio.findMany({
    where: {
      utenteId,
      stato: { in: ["ATTIVO", "SCADUTO"] },
    },
    include: { libro: true },
    orderBy: { dataNoleggio: "desc" },
  });

  const storicoNoleggi = await prisma.noleggio.findMany({
    where: { utenteId, stato: "RESTITUITO" },
    include: { libro: true },
    orderBy: { dataRestituzione: "desc" },
  });

  const cartaFedelta = await prisma.cartaFedelta.findUnique({
    where: { utenteId },
    include: {
      movimenti: { orderBy: { dataMovimento: "desc" } },
    },
  });

  return { noleggiAttivi, storicoNoleggi, cartaFedelta };
};