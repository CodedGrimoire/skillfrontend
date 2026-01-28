"use client";

import { useEffect, useState } from "react";
import { get } from "@/src/lib/api";
import { useAuth } from "@/src/context/AuthContext";
import { UsersIcon, GraduationCapIcon, ChartBarIcon, BookOpenIcon } from "@/components/ui/Icons";

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
        const res = await get<{ success: boolean; stats: AdminStats }>("/api/admin/stats");
        // Extract stats from response: { success: true, stats: { totalUsers, totalTutors, ... } }
        const statsData = res.data.stats || res.data;
        // Map API field names to component field names
        setStats({
          users: statsData.totalUsers ?? statsData.users ?? 0,
          tutors: statsData.totalTutors ?? statsData.tutors ?? 0,
          students: statsData.totalStudents ?? statsData.students ?? 0,
          bookings: statsData.totalBookings ?? statsData.bookings ?? 0,
        });
      } catch (err) {
        setStats({ users: 0, tutors: 0, students: 0, bookings: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      label: "Total Users",
      value: stats?.users ?? 0,
      icon: UsersIcon,
      color: "from-blue-500/20 to-indigo-500/20",
      iconColor: "text-blue-400",
      valueColor: "text-blue-400",
    },
    {
      label: "Students",
      value: stats?.students ?? 0,
      icon: GraduationCapIcon,
      color: "from-emerald-500/20 to-teal-500/20",
      iconColor: "text-emerald-400",
      valueColor: "text-emerald-400",
    },
    {
      label: "Tutors",
      value: stats?.tutors ?? 0,
      icon: ChartBarIcon,
      color: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-400",
      valueColor: "text-purple-400",
    },
    {
      label: "Bookings",
      value: stats?.bookings ?? 0,
      icon: BookOpenIcon,
      color: "from-cyan-500/20 to-blue-500/20",
      iconColor: "text-cyan-400",
      valueColor: "text-cyan-400",
    },
  ];

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-white glow-text">
          Welcome, {user?.name ?? "Admin"}
        </h1>
        <p className="text-sm text-white/70">Platform overview and health.</p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="glass-card group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-50 group-hover:opacity-70 transition-opacity`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} border border-white/10`}>
                    <Icon className={`h-6 w-6 ${card.iconColor}`} />
                  </div>
                </div>
                <p className="text-sm font-medium text-white/70 uppercase tracking-wide mb-2">
                  {card.label}
                </p>
                <p className={`text-4xl font-bold ${card.valueColor} transition-all`}>
                  {loading ? (
                    <span className="inline-block animate-pulse">—</span>
                  ) : (
                    card.value
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
