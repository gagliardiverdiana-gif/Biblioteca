import { Request, Response } from "express";
import * as libriService from "../services/libri.service";

export const getLibri = async (_req: Request, res: Response) => {
  try {
    const libri = await libriService.getLibri();

    res.status(200).json(libri);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};
