import { Request, Response } from "express";
import * as adminNoleggiService from "../services/adminNoleggi.service";

export const getAdminNoleggi = async (req: Request, res: Response) => {
  try {
    const stato = req.query.stato as string | undefined;

    const noleggi = await adminNoleggiService.getNoleggi(stato);

    res.status(200).json(noleggi);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const restituisciNoleggioAdmin = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const risultato = await adminNoleggiService.restituisciNoleggioAdmin(id);

    res.status(200).json(risultato);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};
