import { Router } from "express";
import {
  createNoleggio,
  restituisciNoleggio,
  getMieiNoleggi,
} from "../controllers/noleggi.controller";
import { isAuthenticated } from "../middleware/auth.middleware";

const router = Router();

router.get("/miei", isAuthenticated, getMieiNoleggi);
router.post("/", isAuthenticated, createNoleggio);
router.patch("/:id/restituzione", isAuthenticated, restituisciNoleggio);

export default router;
