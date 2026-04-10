"use client";

import { useEffect, useMemo, useState } from "react";
import { get } from "@/src/lib/api";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { OverviewCard } from "@/components/dashboard/OverviewCard";
import { LoadingGrid } from "@/components/layout/LoadingGrid";
import { EmptyState } from "@/components/layout/EmptyState";

type User = { id: string; role?: string };
type Booking = { id: string; category?: string; price?: number; date?: string };
type Category = { id: string; name: string };

export default function AdminAnalyticsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [usersRes, bookingsRes, categoriesRes] = await Promise.all([
          get<User[] | { users?: User[] }>("/api/admin/users").catch(() => ({ data: [] })),
          get<Booking[] | { bookings?: Booking[] }>("/api/admin/bookings").catch(() => ({ data: [] })),
          get<Category[] | { categories?: Category[] }>("/api/admin/categories").catch(() => ({ data: [] })),
        ]);

        setUsers(Array.isArray(usersRes.data) ? usersRes.data : (usersRes.data as any)?.users || []);
        setBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data : (bookingsRes.data as any)?.bookings || []);
        setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : (categoriesRes.data as any)?.categories || []);
      } catch (err) {
        setError("Unable to load analytics right now.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const roleRatio = useMemo(() => {
    const counts: Record<string, number> = {};
    users.forEach((u) => {
      const key = (u.role || "UNKNOWN").toUpperCase();
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).map(([label, value]) => ({ label, value }));
  }, [users]);

  const bookingsByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    bookings.forEach((b) => {
      const key = b.category || "Uncategorized";
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).map(([label, value]) => ({ label, value }));
  }, [bookings]);

  const revenueProxy = useMemo(() => {
    const sums: Record<string, number> = {};
    bookings.forEach((b) => {
      const month = b.date ? new Date(b.date) : null;
      if (!month || isNaN(month.getTime())) return;
      const key = `${month.getFullYear()}-${month.getMonth() + 1}`;
      const amount = b.price ?? 0;
      sums[key] = (sums[key] || 0) + amount;
    });
    return Object.entries(sums)
      .sort((a, b) => (a[0] > b[0] ? 1 : -1))
      .map(([label, value]) => ({ label, value }));
  }, [bookings]);

  const topCategory =
    bookingsByCategory.length > 0
      ? bookingsByCategory.slice().sort((a, b) => b.value - a.value)[0].label
      : "—";

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <OverviewCard title="Categories" value={`${categories.length}`} sublabel="Tracked subjects" />
        <OverviewCard title="Top category" value={topCategory} sublabel="Most booked" accent="from-amber-500/20 to-orange-500/20" />
        <OverviewCard title="Bookings (sample)" value={`${bookings.length}`} sublabel="For analytics set" accent="from-blue-500/20 to-cyan-500/20" />
        <OverviewCard title="Role spread" value={`${roleRatio.reduce((s, r) => s + r.value, 0)}`} sublabel="Total accounts" accent="from-purple-500/20 to-pink-500/20" />
      </div>

      {loading ? (
        <LoadingGrid items={6} columns={3} />
      ) : error ? (
        <div className="glass-card px-4 py-3 text-sm text-rose-300 border-rose-500/30 bg-rose-500/10">{error}</div>
      ) : bookings.length === 0 && users.length === 0 ? (
        <EmptyState
          title="No analytics data"
          description="Data will appear once users and bookings are present."
          actionLabel="Invite users"
          actionHref="/register"
        />
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard title="Bookings by category" subtitle="Top subjects" type="bar" data={bookingsByCategory} />
            <ChartCard title="Role ratio" subtitle="Users by role" type="donut" data={roleRatio} />
          </div>
          <ChartCard title="Revenue proxy" subtitle="Sum of booking prices by month" type="bar" data={revenueProxy} />
        </>
      )}
    </div>
  );
}
