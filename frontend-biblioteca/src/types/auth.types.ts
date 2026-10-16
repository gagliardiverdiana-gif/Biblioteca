export type AuthSession = {
  userId: number;
  ruolo: string;
  email: string;
};

export type MeResponse = {
  message: string;
  session: AuthSession;
};
