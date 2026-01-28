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
  authLoading: boolean; // Alias for loading for clarity
  login: (token: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Start with loading = true

  // Fetch user data from API
  const fetchMe = useCallback(async (tokenValue: string) => {
    try {
      const res = await get<User>("/api/auth/me");
      setUser(res.data);
      setToken(tokenValue);
    } catch (err) {
      // Token is invalid/expired - clear everything
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
      setToken(null);
      setUser(null);
    }
  }, []);

  // Initialize auth state on mount
  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      
      if (storedToken) {
        // Token exists - fetch user data
        await fetchMe(storedToken);
      }
      
      // Always set loading to false after initialization
      setLoading(false);
    };

    initializeAuth();
  }, [fetchMe]);

  const login = useCallback(
    async (newToken: string) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("token", newToken);
      }
      setToken(newToken);
      await fetchMe(newToken);
    },
    [fetchMe],
  );

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    setToken(null);
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    if (token) {
      await fetchMe(token);
    }
  }, [token, fetchMe]);

  const value = useMemo(
    () => ({ user, token, loading, authLoading: loading, login, logout, refresh }),
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
