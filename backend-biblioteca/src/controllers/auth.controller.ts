import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const user = await authService.login(req.body);

    req.session.userId = user.id;
    req.session.ruolo = user.ruolo;
    req.session.email = user.email;

    res.status(200).json({
      message: "Login effettuato con successo",
      user,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const me = async (req: Request, res: Response) => {
  if (!req.session.userId) {
    return res.status(401).json({
      message: "Utente non autenticato",
    });
  }

  return res.status(200).json({
    message: "Utente autenticato",
    session: {
      userId: req.session.userId,
      ruolo: req.session.ruolo,
      email: req.session.email,
    },
  });
};

export const logout = async (req: Request, res: Response) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        message: "Errore durante il logout",
      });
    }

    res.clearCookie("connect.sid");

    return res.status(200).json({
      message: "Logout effettuato con successo",
    });
  });
};
