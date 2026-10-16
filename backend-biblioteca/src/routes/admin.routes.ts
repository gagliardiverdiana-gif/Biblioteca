import { Router } from "express";
import { isAdmin } from "../middleware/auth.middleware";
import { getAdminStats } from "../controllers/admin.controller";

const router = Router();

router.get("/stats", isAdmin, getAdminStats);

export default router;