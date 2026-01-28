"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { post } from "@/src/lib/api";
import { redirectForRole } from "@/src/lib/auth";
import { useAuth } from "@/src/context/AuthContext";

const roles = [
  { value: "STUDENT", label: "Student" },
  { value: "TUTOR", label: "Tutor" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      router.push(redirectForRole(userRole));
    } catch (err: unknown) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Create account</h1>
        <p className="text-sm text-slate-600">
          Join as a student or tutor to start learning or teaching.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-inner outline-none transition focus:border-slate-400 focus:bg-slate-50"
            placeholder="Alex Johnson"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-inner outline-none transition focus:border-slate-400 focus:bg-slate-50"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-inner outline-none transition focus:border-slate-400 focus:bg-slate-50"
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800" htmlFor="role">
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-inner outline-none transition focus:border-slate-400 focus:bg-slate-50"
          >
            {roles.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>
    </div>
  );
}
