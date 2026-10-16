import { Router } from "express";
import {
  getAdminNoleggi,
  restituisciNoleggioAdmin,
} from "../controllers/adminNoleggi.controller";
import { isAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/", isAdmin, getAdminNoleggi);
router.patch("/:id/restituzione", isAdmin, restituisciNoleggioAdmin);

export default router;