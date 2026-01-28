"use client";

import { useEffect, useState } from "react";
import { get } from "@/src/lib/api";
import { useAuth } from "@/src/context/AuthContext";

type BookingStat = {
  upcoming: number;
  completed: number;
  cancelled: number;
};

export default function StudentOverviewPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<BookingStat | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await get<BookingStat>("/api/bookings/stats");
        setStats(res.data);
      } catch (err) {
        setStats({ upcoming: 0, completed: 0, cancelled: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">
          Welcome back{user?.name ? `, ${user.name}` : ""} 👋
        </h1>
        <p className="text-sm text-slate-600">
          Track your learning and upcoming sessions here.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {["upcoming", "completed", "cancelled"].map((key) => {
          const value = stats?.[key as keyof BookingStat] ?? 0;
          return (
            <div
              key={key}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-slate-500 capitalize">{key}</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {loading ? "—" : value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
