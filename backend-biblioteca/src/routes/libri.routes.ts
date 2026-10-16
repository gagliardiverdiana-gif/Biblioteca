import { Router } from "express";
import { getLibri } from "../controllers/libri.controller";

const router = Router();

router.get("/", getLibri);

export default router;
