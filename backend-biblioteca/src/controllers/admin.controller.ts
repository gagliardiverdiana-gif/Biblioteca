import { Request, Response } from "express";
import { getDashboardStats } from "../services/adminNoleggi.service";

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const stats = await getDashboardStats();

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({
      message: "Errore nel recupero delle statistiche admin",
    });
  }
};
