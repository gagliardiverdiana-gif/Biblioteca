import "dotenv/config";
import bcrypt from "bcrypt";
import prisma from "../config/prisma";

const main = async () => {
  const email = process.argv[2]?.trim().toLowerCase();
  const password = process.argv[3];

  if (!email || !password) {
    console.error("Uso: npx tsx src/scripts/creaAdmin.ts <email> <password>");
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 10);

  await prisma.utente.upsert({
    where: { email },
    update: { password: hash },
    create: {
      nomeCompleto: "Amministratore",
      email,
      password: hash,
      ruolo: "ADMIN",
      cartaFedelta: { create: { puntiTotali: 0 } },
    },
  });

  console.log(`Fatto: ${email} ora ha la password hashata`);
  await prisma.$disconnect();
};

main();
