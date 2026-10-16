import { Request, Response } from "express";
import * as noleggiService from "../services/noleggi.service";

export const createNoleggio = async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    const { libroId } = req.body;

    const noleggio = await noleggiService.createNoleggio({
      utenteId: userId!,
      libroId,
    });

    res.status(201).json(noleggio);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const restituisciNoleggio = async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    const noleggioId = Number(req.params.id);

    const risultato = await noleggiService.restituisciNoleggio({
      noleggioId,
      utenteId: userId!,
    });

    res.status(200).json(risultato);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getMieiNoleggi = async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;

    const dati = await noleggiService.getMieiNoleggi(userId!);

    res.status(200).json(dati);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};
