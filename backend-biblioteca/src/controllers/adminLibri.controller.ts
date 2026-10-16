import { Request, Response } from "express";
import * as adminLibriService from "../services/adminLibri.service";

export const getAdminLibri = async (_req: Request, res: Response) => {
  try {
    const libri = await adminLibriService.getLibri();
    res.status(200).json(libri);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const createLibroAdmin = async (req: Request, res: Response) => {
  try {
    const libro = await adminLibriService.createLibro(req.body);
    res.status(201).json(libro);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const updateLibroAdmin = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const libro = await adminLibriService.updateLibro(id, req.body);
    res.status(200).json(libro);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteLibroAdmin = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await adminLibriService.deleteLibro(id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};
