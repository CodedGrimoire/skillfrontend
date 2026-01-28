"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { post } from "@/src/lib/api";
import { redirectForRole } from "@/src/lib/auth";
import { useAuth } from "@/src/context/AuthContext";
import { useToast } from "@/src/context/ToastContext";
import { Spinner } from "@/components/ui/Spinner";
import { EyeIcon, EyeOffIcon } from "@/components/ui/Icons";
import { AuthGate } from "@/src/components/AuthGate";

export default function LoginPage() {
  const router = useRouter();
  const { login, refreshUser, user, authLoading } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);
      const res = await post<{ token: string; role: string }>("/api/auth/login", {
        email,
        password,
      });

      const { token } = res.data;
      
      // Save token and fetch user data
      // login() saves token to localStorage and calls fetchMe to get user data
      await login(token);
      
      // Wait for user to be set before showing success/redirecting
      // The redirect will happen in useEffect when user is available
      showToast("Logged in successfully", "success");
    } catch (err: unknown) {
      setError("Login failed. Please check your credentials.");
      showToast("Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // Redirect after user data is loaded from login
  // Note: AuthGate will also handle redirect for already-authenticated users
  // This useEffect handles redirect after successful login
  useEffect(() => {
    // Don't redirect if still loading auth
    if (authLoading) {
      return;
    }

    // Only redirect if user exists and has a role
    // This handles the case where user was just set after login
    if (user && user.role) {
      const targetPath = redirectForRole(user.role);
      // Only redirect if we're still on the login page
      if (typeof window !== "undefined" && window.location.pathname === "/login") {
        console.log("🔍 [LoginPage] User loaded, redirecting to:", targetPath);
        router.replace(targetPath);
      }
    }
  }, [authLoading, user, router]);

  return (
    <AuthGate mode="publicOnly">

      <div className="mx-auto max-w-md glass-card">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
          <p className="text-sm text-white/70">
            Log in to manage your learning journey.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-input w-full"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input w-full pr-10"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="glass-card px-4 py-3 text-sm text-rose-300 border-rose-500/30 bg-rose-500/10">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="glass-btn w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Spinner size={14} />
                Signing in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </AuthGate>
  );
}
