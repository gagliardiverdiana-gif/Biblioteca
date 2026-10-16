import { Router } from "express";
import rateLimit from "express-rate-limit";
import { register, login, me, logout } from "../controllers/auth.controller";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Troppi tentativi, riprova tra qualche minuto" },
});

router.post("/register", register);
router.post("/login", loginLimiter, login);
router.get("/me", me);
router.post("/logout", logout);

export default router;