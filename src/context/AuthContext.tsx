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
  refreshUser: () => Promise<void>; // Explicit refresh user method
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Runtime type guard to validate user payloads from the API
function isUser(value: unknown): value is User {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<User>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.email === "string" &&
    (candidate.role === "STUDENT" || candidate.role === "TUTOR" || candidate.role === "ADMIN")
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Start with loading = true

  // Fetch user data from API
  const fetchMe = useCallback(async (tokenValue: string) => {
    try {
      console.log("🔍 [AuthContext] fetchMe called with token:", tokenValue ? `${tokenValue.substring(0, 20)}...` : "null");
      setLoading(true);
      
      // Ensure token is in localStorage before making request (for interceptor)
      if (typeof window !== "undefined" && tokenValue) {
        localStorage.setItem("token", tokenValue);
        console.log("🔍 [AuthContext] Token saved to localStorage");
      }
      
      console.log("🔍 [AuthContext] Calling GET /api/auth/me");
      const res = await get<{ success?: boolean; user?: User }>("/api/auth/me");
      console.log("🔍 [AuthContext] /api/auth/me response:", res.data);
      
      // Extract user from response.data.user (API returns { success: true, user: {...} })
      const userData = (res.data as any).user ?? res.data;
      
      // Validate user data structure
      if (isUser(userData)) {
        setUser(userData);
        setToken(tokenValue);
        console.log("🔍 [AuthContext] User set successfully:", userData);
      } else {
        console.error("🔍 [AuthContext] Invalid user data structure:", userData);
        throw new Error("Invalid user data structure");
      }
    } catch (err: any) {
      console.error("🔍 [AuthContext] fetchMe error:", err);
      const status = err?.response?.status;
      const isAuthError = status === 401 || status === 403;
      
      console.error("🔍 [AuthContext] Error details:", {
        message: err?.message,
        response: err?.response?.data,
        status,
        isAuthError,
      });
      
      // Only remove token if it's an authentication error (401/403)
      // Don't remove token for other errors (network, validation, etc.)
      if (isAuthError) {
        console.log("🔍 [AuthContext] Authentication error (401/403), removing token");
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
        setToken(null);
        setUser(null);
      } else {
        // For other errors, keep token but clear user
        // This allows retry without re-login
        console.log("🔍 [AuthContext] Non-auth error, keeping token but clearing user");
        setUser(null);
      }
    } finally {
      setLoading(false);
      console.log("🔍 [AuthContext] fetchMe completed, loading set to false");
    }
  }, []);

  // Refresh user data (public method)
  const refreshUser = useCallback(async () => {
    const currentToken = token || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    if (currentToken) {
      await fetchMe(currentToken);
    }
  }, [token, fetchMe]);

  // Initialize auth state on mount
  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    const initializeAuth = async () => {
      console.log("🔍 [AuthContext] Initializing auth...");
      const storedToken = localStorage.getItem("token");
      console.log("🔍 [AuthContext] Stored token:", storedToken ? `${storedToken.substring(0, 20)}...` : "null");
      
      if (storedToken) {
        // Token exists - fetch user data (fetchMe will set loading to false)
        console.log("🔍 [AuthContext] Token found, calling fetchMe...");
        await fetchMe(storedToken);
      } else {
        // No token - set loading to false immediately
        console.log("🔍 [AuthContext] No token found, setting loading to false");
        setLoading(false);
      }
    };

    initializeAuth();
  }, [fetchMe]);

  const login = useCallback(
    async (newToken: string) => {
      console.log("🔍 [AuthContext] login called with token:", newToken ? `${newToken.substring(0, 20)}...` : "null");
      
      // Save token to localStorage first
      if (typeof window !== "undefined") {
        localStorage.setItem("token", newToken);
        console.log("🔍 [AuthContext] Token saved to localStorage in login()");
      }
      setToken(newToken);
      
      // Fetch user data immediately
      console.log("🔍 [AuthContext] Calling fetchMe from login()...");
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
    () => ({ user, token, loading, authLoading: loading, login, logout, refresh, refreshUser }),
    [user, token, loading, login, logout, refresh, refreshUser],
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
