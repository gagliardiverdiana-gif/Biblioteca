import { Router } from "express";
import {
  getAdminLibri,
  createLibroAdmin,
  updateLibroAdmin,
  deleteLibroAdmin,
} from "../controllers/adminLibri.controller";
import { isAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/", isAdmin, getAdminLibri);
router.post("/", isAdmin, createLibroAdmin);
router.patch("/:id", isAdmin, updateLibroAdmin);
router.delete("/:id", isAdmin, deleteLibroAdmin);

export default router;
