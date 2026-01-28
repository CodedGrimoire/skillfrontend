"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { get } from "@/src/lib/api";

type User = {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "TUTOR" | "ADMIN";
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(
    async (tokenValue?: string) => {
      const activeToken = tokenValue ?? token;
      if (!activeToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await get<User>("/api/auth/me");
        setUser(res.data);
      } catch (err) {
        // Token might be invalid/expired; clear stored creds.
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (stored) {
      setToken(stored);
      fetchMe(stored);
    } else {
      setLoading(false);
    }
  }, [fetchMe]);

  const login = useCallback(
    async (newToken: string) => {
      localStorage.setItem("token", newToken);
      setToken(newToken);
      await fetchMe(newToken);
    },
    [fetchMe],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    await fetchMe();
  }, [fetchMe]);

  const value = useMemo(
    () => ({ user, token, loading, login, logout, refresh }),
    [user, token, loading, login, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
