import prisma from "../config/prisma";
import bcrypt from "bcrypt";

type RegisterInput = {
  nomeCompleto: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const register = async (input: RegisterInput) => {
  const nomeCompleto = String(input.nomeCompleto ?? "").trim();
  const email = String(input.email ?? "").trim().toLowerCase();
  const password = String(input.password ?? "");

  if (nomeCompleto.length < 2) {
    throw new Error("Inserisci il nome completo");
  }

  if (!EMAIL_REGEX.test(email)) {
    throw new Error("Email non valida");
  }

  if (password.length < 8) {
    throw new Error("La password deve avere almeno 8 caratteri");
  }

  const existingUser = await prisma.utente.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email già registrata");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.utente.create({
    data: {
      nomeCompleto,
      email,
      password: hashedPassword,
      ruolo: "USER",
      cartaFedelta: {
        create: { puntiTotali: 0 },
      },
    },
    select: {
      id: true,
      nomeCompleto: true,
      email: true,
      ruolo: true,
      createdAt: true,
    },
  });
};

export const login = async (input: LoginInput) => {
  const email = String(input.email ?? "").trim().toLowerCase();
  const password = String(input.password ?? "");

  const user = await prisma.utente.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Credenziali non valide");
  }

  const passwordCorretta = await bcrypt.compare(password, user.password);

  if (!passwordCorretta) {
    throw new Error("Credenziali non valide");
  }

  return {
    id: user.id,
    nomeCompleto: user.nomeCompleto,
    email: user.email,
    ruolo: user.ruolo,
  };
};