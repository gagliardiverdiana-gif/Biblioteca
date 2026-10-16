import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import api from "../api/axios";
import type { AuthSession, MeResponse } from "../types/auth.types";

type AuthContextValue = {
  user: AuthSession | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

   const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get<MeResponse>("/auth/me");
      setUser(data.session);
    } catch {
      setUser(null);
    }
  }, []);

  // Ripristina la sessione al caricamento / refresh della pagina
  useEffect(() => {
    const initAuth = async () => {
      await refreshUser();
      setLoading(false);
    };

    initAuth();
  }, [refreshUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      await api.post("/auth/login", { email, password });
      await refreshUser();
    },
    [refreshUser],
  );

  const logout = useCallback(async () => {
    await api.post("/auth/logout");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAdmin: user?.ruolo === "ADMIN", loading, login, logout }),
    [user, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve essere usato dentro AuthProvider");
  return ctx;
}