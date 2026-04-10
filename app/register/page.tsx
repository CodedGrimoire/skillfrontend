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

const roles = [
  { value: "STUDENT", label: "Student" },
  { value: "TUTOR", label: "Tutor" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { login, user, authLoading } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect after user data is loaded from registration
  useEffect(() => {
    if (!authLoading && user && user.role) {
      router.replace(redirectForRole(user.role));
    }
  }, [authLoading, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords must match.");
      return;
    }

    try {
      setLoading(true);
      const res = await post<{ token: string; role: string }>("/api/auth/register", {
        name,
        email,
        password,
        role,
      });

      const { token } = res.data;
      
      // Save token and fetch user data
      await login(token);
      showToast("Account created", "success");
      
      // Note: Redirect will happen in useEffect when user.role is available
    } catch (err: unknown) {
      setError("Registration failed. Please try again.");
      showToast("Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGate mode="publicOnly">
      <div className="mx-auto max-w-5xl grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start py-6">
        <AuthCard title="Create account" subtitle="Join as a student or tutor to start learning or teaching.">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="glass-input w-full"
                placeholder="Alex Johnson"
                required
              />
            </div>

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

            <PasswordField
              id="confirmPassword"
              label="Confirm password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="••••••••"
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90" htmlFor="role">
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="glass-input w-full"
              >
                {roles.map((r) => (
                  <option key={r.value} value={r.value} className="bg-[#0a0e27]">
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs text-white/70 flex items-center justify-between">
              <span>Already have an account? <Link href="/login" className="underline underline-offset-4 hover:text-white">Login</Link></span>
              <Link href="/terms" className="underline underline-offset-4 hover:text-white">Terms</Link>
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
                  Creating account...
                </span>
              ) : (
                "Register"
              )}
            </button>

            <DemoCredentialButtons onFill={({ email, password, role }) => { setEmail(email); setPassword(password); setConfirmPassword(password); if (role) setRole(role); }} />
            <SocialAuthButtons disabled />
          </form>
        </AuthCard>

        <div className="glass-card space-y-4">
          <h3 className="text-lg font-semibold text-white">Why join SkillBridge?</h3>
          <ul className="space-y-2 text-sm text-white/75 list-disc list-inside">
            <li>Students: find vetted tutors, book instantly, and track progress.</li>
            <li>Tutors: showcase your expertise, set availability, and get matched.</li>
            <li>Admins: manage users, categories, and bookings effectively.</li>
          </ul>
          <div className="text-xs text-white/60">Need help? Visit <Link href="/help" className="underline">Help Center</Link>.</div>
        </div>
      </div>
    </AuthGate>
  );
}
