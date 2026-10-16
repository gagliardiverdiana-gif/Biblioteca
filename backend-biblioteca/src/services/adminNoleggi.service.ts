import prisma from "../config/prisma";
import { aggiornaNoleggiScaduti } from "./noleggi.service";

type Stato = "ATTIVO" | "RESTITUITO" | "SCADUTO";
const STATI_VALIDI: Stato[] = ["ATTIVO", "RESTITUITO", "SCADUTO"];

export const getNoleggi = async (stato?: string) => {
  await aggiornaNoleggiScaduti();

  let where = {};

  if (stato && stato !== "TUTTI") {
    if (!STATI_VALIDI.includes(stato as Stato)) {
      throw new Error("Stato non valido");
    }
    where = { stato: stato as Stato };
  }

  return prisma.noleggio.findMany({
    where,
    include: {
      utente: {
        select: { id: true, nomeCompleto: true, email: true, ruolo: true },
      },
      libro: {
        select: { id: true, titolo: true, autore: true },
      },
    },
    orderBy: { dataNoleggio: "desc" },
  });
};

export const getDashboardStats = async () => {
  await aggiornaNoleggiScaduti();

  const [totaleLibri, noleggiTotali, noleggiAttivi, libriRestituiti] =
    await Promise.all([
      prisma.libro.count(),
      prisma.noleggio.count(),
      prisma.noleggio.count({
        where: { stato: { in: ["ATTIVO", "SCADUTO"] } },
      }),
      prisma.noleggio.count({ where: { stato: "RESTITUITO" } }),
    ]);

  return { totaleLibri, noleggiTotali, noleggiAttivi, libriRestituiti };
};
export const restituisciNoleggioAdmin = async (noleggioId: number) => {
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

    return tx.noleggio.findUnique({
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
  });
};