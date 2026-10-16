import "dotenv/config";
import prisma from "../config/prisma";

const libri = [
  { titolo: "Il nome della rosa", autore: "Umberto Eco", genere: "Giallo storico", descrizione: "Un monaco indaga su una serie di morti misteriose in un'abbazia medievale.", copie: 3 },
  { titolo: "Il Gattopardo", autore: "Giuseppe Tomasi di Lampedusa", genere: "Romanzo storico", descrizione: "La decadenza dell'aristocrazia siciliana ai tempi dell'unità d'Italia.", copie: 2 },
  { titolo: "Se questo è un uomo", autore: "Primo Levi", genere: "Memoir", descrizione: "La testimonianza dell'autore sulla prigionia nel campo di Auschwitz.", copie: 4 },
  { titolo: "Il barone rampante", autore: "Italo Calvino", genere: "Fantastico", descrizione: "Un ragazzo decide di vivere per sempre sugli alberi.", copie: 2 },
  { titolo: "Il piccolo principe", autore: "Antoine de Saint-Exupéry", genere: "Favola", descrizione: "L'incontro tra un aviatore e un piccolo principe venuto da un altro pianeta.", copie: 5 },
  { titolo: "Orgoglio e pregiudizio", autore: "Jane Austen", genere: "Romanzo", descrizione: "Elizabeth Bennet e il signor Darcy tra convenzioni sociali e amore.", copie: 3 },
  { titolo: "Cent'anni di solitudine", autore: "Gabriel García Márquez", genere: "Realismo magico", descrizione: "La saga della famiglia Buendía nel villaggio immaginario di Macondo.", copie: 2 },
  { titolo: "Il vecchio e il mare", autore: "Ernest Hemingway", genere: "Romanzo", descrizione: "La sfida di un anziano pescatore cubano con un enorme marlin.", copie: 3 },
  { titolo: "Dune", autore: "Frank Herbert", genere: "Fantascienza", descrizione: "Intrighi e potere sul pianeta desertico Arrakis, unica fonte della spezia.", copie: 2 },
  { titolo: "Sapiens", autore: "Yuval Noah Harari", genere: "Saggio", descrizione: "Una breve storia dell'umanità, dalla preistoria ai giorni nostri.", copie: 4 },
  { titolo: "The Pragmatic Programmer", autore: "Andrew Hunt, David Thomas", genere: "Informatica", descrizione: "Consigli pratici per diventare sviluppatori più efficaci.", copie: 2 },
  { titolo: "1984", autore: "George Orwell", genere: "Distopia", descrizione: "Un regime totalitario controlla ogni aspetto della vita dei cittadini.", copie: 3 },
  { titolo: "Clean Code", autore: "Robert C. Martin", genere: "Informatica", descrizione: "Come scrivere codice leggibile, semplice e manutenibile.", copie: 2 },
];

const main = async () => {
  for (const { copie, ...libro } of libri) {
    await prisma.libro.upsert({
      where: { titolo_autore: { titolo: libro.titolo, autore: libro.autore } },
      update: {},
      create: { ...libro, copieTotali: copie, copieDisponibili: copie },
    });
  }

  console.log(`Catalogo pronto: ${libri.length} libri`);
  await prisma.$disconnect();
};

main();