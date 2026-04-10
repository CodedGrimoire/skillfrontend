"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { post } from "@/src/lib/api";
import { redirectForRole } from "@/src/lib/auth";
import { useAuth } from "@/src/context/AuthContext";
import { useToast } from "@/src/context/ToastContext";
import { Spinner } from "@/components/ui/Spinner";
import { AuthGate } from "@/src/components/AuthGate";
import { AuthCard } from "@/components/auth/AuthCard";
import { PasswordField } from "@/components/auth/PasswordField";
import { DemoCredentialButtons } from "@/components/auth/DemoCredentialButtons";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";

export default function LoginPage() {
  const router = useRouter();
  const { login, refreshUser, user, authLoading } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      <div className="mx-auto max-w-5xl grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start py-6">
        <AuthCard title="Welcome back" subtitle="Log in to manage your learning and sessions.">
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <PasswordField
              id="password"
              label="Password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
            />

            <div className="flex items-center justify-between text-xs text-white/70">
              <Link href="/help" className="underline underline-offset-4 hover:text-white">Forgot password?</Link>
              <Link href="/register" className="underline underline-offset-4 hover:text-white">Create account</Link>
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

            <DemoCredentialButtons onFill={({ email, password }) => { setEmail(email); setPassword(password); }} />

            <SocialAuthButtons disabled />
          </form>
        </AuthCard>

        <div className="glass-card space-y-4">
          <h3 className="text-lg font-semibold text-white">Why log in?</h3>
          <ul className="space-y-2 text-sm text-white/75 list-disc list-inside">
            <li>Book and manage sessions faster.</li>
            <li>Track progress and feedback from tutors.</li>
            <li>Save tutors and subjects you follow.</li>
          </ul>
          <div className="text-xs text-white/60">Need help? Visit <Link href="/help" className="underline">Help Center</Link>.</div>
        </div>
      </div>
    </AuthGate>
  );
}
