"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { post } from "@/src/lib/api";
import { redirectForRole } from "@/src/lib/auth";
import { useAuth } from "@/src/context/AuthContext";
import { useToast } from "@/src/context/ToastContext";
import { Spinner } from "@/components/ui/Spinner";
import { EyeIcon, EyeOffIcon } from "@/components/ui/Icons";
import { AuthGate } from "@/src/components/AuthGate";

const roles = [
  { value: "STUDENT", label: "Student" },
  { value: "TUTOR", label: "Tutor" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("STUDENT");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError("All fields are required.");
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

      const { token, role: userRole } = res.data;
      await login(token);
      showToast("Account created", "success");
      router.replace(redirectForRole(userRole));
    } catch (err: unknown) {
      setError("Registration failed. Please try again.");
      showToast("Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGate mode="publicOnly">
      <div className="mx-auto max-w-md glass-card">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-white">Create account</h1>
          <p className="text-sm text-white/70">
            Join as a student or tutor to start learning or teaching.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
      </form>
    </div>
    </AuthGate>
  );
}
