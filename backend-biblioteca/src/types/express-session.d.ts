import "express-session";

declare module "express-session" {
  interface SessionData {
    userId?: number;
    ruolo?: string;
    email?: string;
  }
}
