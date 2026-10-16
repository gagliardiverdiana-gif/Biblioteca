import prisma from "../config/prisma";

export const getLibri = async () => {
  return await prisma.libro.findMany({
    orderBy: {
      titolo: "asc",
    },
    select: {
      id: true,
      titolo: true,
      autore: true,
      genere: true,
      descrizione: true,
      copieTotali: true,
      copieDisponibili: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};
