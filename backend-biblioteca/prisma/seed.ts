import "dotenv/config";
import { PrismaClient, RuoloUtente } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcrypt";

const adapter = new PrismaMariaDb({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "biblioteca_db",
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);

  const admin = await prisma.utente.upsert({
    where: { email: "admin@biblioteca.it" },
    update: {},
    create: {
      nomeCompleto: "Admin Biblioteca",
      email: "admin@biblioteca.it",
      password: passwordHash,
      ruolo: RuoloUtente.ADMIN,
      cartaFedelta: {
        create: {
          puntiTotali: 0,
        },
      },
    },
  });

  const libri = [
    {
      titolo: "Il Nome della Rosa",
      autore: "Umberto Eco",
      genere: "Romanzo storico",
      descrizione: "Un giallo medievale ambientato in un'abbazia.",
      copieTotali: 5,
      copieDisponibili: 5,
    },
    {
      titolo: "1984",
      autore: "George Orwell",
      genere: "Distopia",
      descrizione: "Romanzo distopico sul controllo totalitario.",
      copieTotali: 4,
      copieDisponibili: 4,
    },
    {
      titolo: "I Promessi Sposi",
      autore: "Alessandro Manzoni",
      genere: "Classico",
      descrizione: "Romanzo storico della letteratura italiana.",
      copieTotali: 3,
      copieDisponibili: 3,
    },
    {
      titolo: "Clean Code",
      autore: "Robert C. Martin",
      genere: "Programmazione",
      descrizione: "Buone pratiche per scrivere codice pulito.",
      copieTotali: 2,
      copieDisponibili: 2,
    },
  ];

  for (const libro of libri) {
    await prisma.libro.upsert({
      where: {
        titolo_autore: {
          titolo: libro.titolo,
          autore: libro.autore,
        },
      },
      update: {
        genere: libro.genere,
        descrizione: libro.descrizione,
        copieTotali: libro.copieTotali,
        copieDisponibili: libro.copieDisponibili,
      },
      create: libro,
    });
  }

  console.log("Seed completato con successo.");
  console.log("Admin:", admin.email);
}

main()
  .catch((e) => {
    console.error("Errore nel seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
