import { Request, Response, NextFunction } from "express";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.session.userId) {
    return res.status(401).json({
      message: "Utente non autenticato",
    });
  }

  next();
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    return res.status(401).json({
      message: "Utente non autenticato",
    });
  }

  if (req.session.ruolo !== "ADMIN") {
    return res.status(403).json({
      message: "Accesso riservato agli amministratori",
    });
  }

  next();
};
