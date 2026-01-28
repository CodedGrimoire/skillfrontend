"use client";

import { useEffect, useState } from "react";
import { get } from "@/src/lib/api";
import { useAuth } from "@/src/context/AuthContext";

type AdminStats = {
  users: number;
  tutors: number;
  students: number;
  bookings: number;
};

export default function AdminOverviewPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await get<AdminStats>("/api/admin/stats");
        setStats(res.data);
      } catch (err) {
        setStats({ users: 0, tutors: 0, students: 0, bookings: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Total Users", value: stats?.users ?? 0 },
    { label: "Students", value: stats?.students ?? 0 },
    { label: "Tutors", value: stats?.tutors ?? 0 },
    { label: "Bookings", value: stats?.bookings ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">
          Welcome, {user?.name ?? "Admin"}
        </h1>
        <p className="text-sm text-slate-600">Platform overview and health.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {loading ? "—" : card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
