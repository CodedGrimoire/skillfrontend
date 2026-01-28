"use client";

import { useEffect, useState } from "react";
import { get } from "@/src/lib/api";
import { useAuth } from "@/src/context/AuthContext";

type TutorStats = {
  upcoming: number;
  completed: number;
  earnings?: number;
};

type Session = {
  id: string;
  studentName: string;
  date: string;
  time: string;
  status: string;
};

export default function TutorDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<TutorStats | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, sessionsRes] = await Promise.all([
          get<TutorStats>("/api/tutor/stats"),
          get<Session[]>("/api/tutor/sessions"),
        ]);
        setStats(statsRes.data);
        setSessions(sessionsRes.data);
      } catch (err) {
        setStats({ upcoming: 0, completed: 0, earnings: 0 });
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">
          Welcome, {user?.name ?? "Tutor"}
        </h1>
        <p className="text-sm text-slate-600">
          Manage your sessions and track your performance.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {["upcoming", "completed", "earnings"].map((key) => {
          const value = (stats as any)?.[key] ?? 0;
          const label = key === "earnings" ? "Earnings" : key;
          const display = key === "earnings" ? `$${value}` : value;
          return (
            <div
              key={key}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-slate-500 capitalize">{label}</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {loading ? "—" : display}
              </p>
            </div>
          );
        })}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Sessions</h2>
        </div>
        {loading ? (
          <div className="mt-4 space-y-2">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="h-14 rounded-xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">No sessions yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {s.studentName}
                  </p>
                  <p className="text-sm text-slate-600">
                    {s.date} • {s.time}
                  </p>
                </div>
                <span className="text-xs font-semibold text-slate-700">{s.status}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
