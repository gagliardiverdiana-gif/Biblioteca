import express from "express";
import cors from "cors";
import session from "express-session";
import authRoutes from "./routes/auth.routes";
import libriRoutes from "./routes/libri.routes";
import noleggiRoutes from "./routes/noleggi.routes";
import adminRoutes from "./routes/admin.routes";
import adminLibriRoutes from "./routes/adminLibri.routes";
import adminNoleggiRoutes from "./routes/adminNoleggi.routes";
import helmet from "helmet";

const app = express();
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "super-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // metti true solo in produzione con HTTPS
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

app.use("/auth", authRoutes);
app.use("/libri", libriRoutes);
app.use("/noleggi", noleggiRoutes);
app.use("/admin/libri", adminLibriRoutes);
app.use("/admin/noleggi", adminNoleggiRoutes);
app.use("/admin", adminRoutes);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

export default app;