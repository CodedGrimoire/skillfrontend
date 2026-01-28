"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { get } from "@/src/lib/api";
import { useAuth } from "@/src/context/AuthContext";
import { redirectForRole } from "@/src/lib/auth";
import { Spinner } from "@/components/ui/Spinner";
import { ClockIcon, CheckCircleIcon, XCircleIcon } from "@/components/ui/Icons";

type Booking = {
  id: string;
  status: string;
  date: string;
  [key: string]: unknown;
};

type BookingStat = {
  upcoming: number;
  completed: number;
  cancelled: number;
};

export default function StudentOverviewPage() {
  const { user, authLoading } = useAuth();
  const router = useRouter();
  const hasRedirected = useRef(false);
  const [stats, setStats] = useState<BookingStat>({
    upcoming: 0,
    completed: 0,
    cancelled: 0,
  });
  const [loading, setLoading] = useState(true);

  // Check role and redirect if needed
  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      return;
    }

    // Prevent multiple redirects
    if (hasRedirected.current) {
      return;
    }

    // If no user, AuthGate will handle redirect to login
    if (!user) {
      return;
    }

    // Check role and redirect if not STUDENT
    if (user.role !== "STUDENT") {
      hasRedirected.current = true;
      router.replace(redirectForRole(user.role));
      return;
    }

    // User is STUDENT - proceed to fetch data
  }, [authLoading, user, router]);

  // Fetch bookings only if user is STUDENT
  useEffect(() => {
    // Don't fetch if auth is loading or user is not STUDENT
    if (authLoading || !user || user.role !== "STUDENT" || hasRedirected.current) {
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await get<{ success?: boolean; bookings?: Booking[] } | Booking[]>("/api/bookings/my");
        // Handle both wrapped and unwrapped responses
        const bookingsArray = Array.isArray(res.data) 
          ? res.data 
          : (res.data as any)?.bookings || (res.data as any)?.data || [];
        const bookings = Array.isArray(bookingsArray) ? bookingsArray : [];
        
        // Calculate stats from bookings
        const calculatedStats: BookingStat = {
          upcoming: bookings.filter((b) => b.status === "CONFIRMED" || b.status === "UPCOMING").length,
          completed: bookings.filter((b) => b.status === "COMPLETED").length,
          cancelled: bookings.filter((b) => b.status === "CANCELLED").length,
        };
        
        setStats(calculatedStats);
      } catch (err) {
        // If API fails, just show zeros
        setStats({ upcoming: 0, completed: 0, cancelled: 0 });
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [authLoading, user]);

  // Show loading while checking auth or redirecting
  if (authLoading || (user && user.role !== "STUDENT" && !hasRedirected.current)) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size={32} />
          <p className="text-sm text-slate-600">
            {authLoading ? "Checking authentication..." : "Redirecting..."}
          </p>
        </div>
      </div>
    );
  }

  // Don't render if redirecting
  if (hasRedirected.current || (user && user.role !== "STUDENT")) {
    return null;
  }

  const statCards = [
    {
      key: "upcoming" as const,
      label: "Upcoming",
      icon: ClockIcon,
      color: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-400",
      valueColor: "text-blue-600",
    },
    {
      key: "completed" as const,
      label: "Completed",
      icon: CheckCircleIcon,
      color: "from-emerald-500/20 to-teal-500/20",
      iconColor: "text-emerald-400",
      valueColor: "text-emerald-600",
    },
    {
      key: "cancelled" as const,
      label: "Cancelled",
      icon: XCircleIcon,
      color: "from-rose-500/20 to-pink-500/20",
      iconColor: "text-rose-400",
      valueColor: "text-rose-600",
    },
  ];

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-white glow-text">
          Welcome back{user?.name ? `, ${user.name}` : ""} 👋
        </h1>
        <p className="text-sm text-white/70">
          Track your learning and upcoming sessions here.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-3">
        {statCards.map((card) => {
          const value = stats[card.key] ?? 0;
          const Icon = card.icon;
          return (
            <div
              key={card.key}
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
                    value
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
