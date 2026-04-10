"use client";

import { useEffect, useMemo, useState } from "react";
import { get } from "@/src/lib/api";
import { OverviewCard } from "@/components/dashboard/OverviewCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { DataTableCard } from "@/components/dashboard/DataTableCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { LoadingGrid } from "@/components/layout/LoadingGrid";
import { EmptyState } from "@/components/layout/EmptyState";
import Link from "next/link";

const pageSize = 8;

type Booking = {
  id: string;
  status: string;
  date: string;
  tutorName?: string;
  subject?: string;
  mode?: string;
};

export default function StudentDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await get<{ bookings?: Booking[] } | Booking[]>("/api/bookings/my");
        const arr = Array.isArray(res.data) ? res.data : (res.data as any)?.bookings || (res.data as any)?.data || [];
        const mapped: Booking[] = (arr as any[]).map((b) => ({
          id: b.id,
          status: b.status || "PENDING",
          date: b.date || b.startTime || b.createdAt,
          tutorName: b.tutorName || b.tutor?.name,
          subject: b.subject || b.tutor?.subject,
          mode: b.mode || b.sessionMode || "Online",
        }));
        setBookings(mapped);
      } catch (err) {
        setError("Could not load dashboard data.");
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = useMemo(() => {
    const upcoming = bookings.filter((b) => ["CONFIRMED", "UPCOMING"].includes(b.status)).length;
    const completed = bookings.filter((b) => b.status === "COMPLETED").length;
    const pending = bookings.filter((b) => b.status === "PENDING").length;
    return { upcoming, completed, pending };
  }, [bookings]);

  const statusData = useMemo(
    () => [
      { label: "Upcoming", value: stats.upcoming },
      { label: "Completed", value: stats.completed },
      { label: "Pending", value: stats.pending },
    ],
    [stats],
  );

  const monthlyData = useMemo(() => {
    const counts: Record<string, number> = {};
    bookings.forEach((b) => {
      const d = b.date ? new Date(b.date) : null;
      if (!d || isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => (a[0] > b[0] ? 1 : -1))
      .map(([label, value]) => ({ label, value }));
  }, [bookings]);

  const recentBookings = bookings
    .slice()
    .sort((a, b) => (new Date(b.date).getTime() || 0) - (new Date(a.date).getTime() || 0))
    .slice(0, pageSize);

  return (
    <div className="space-y-6">
      {loading ? (
        <LoadingGrid items={6} columns={3} />
      ) : error ? (
        <div className="glass-card px-4 py-3 text-sm text-rose-300 border-rose-500/30 bg-rose-500/10">{error}</div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <OverviewCard title="Upcoming" value={`${stats.upcoming}`} sublabel="Confirmed or upcoming sessions" />
            <OverviewCard title="Completed" value={`${stats.completed}`} sublabel="Sessions finished" accent="from-emerald-500/20 to-teal-500/20" />
            <OverviewCard title="Pending" value={`${stats.pending}`} sublabel="Awaiting confirmation" accent="from-amber-500/20 to-orange-500/20" />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard
              title="Bookings by month"
              subtitle="Recent activity"
              type="bar"
              data={monthlyData}
            />
            <ChartCard
              title="Status mix"
              subtitle="Session pipeline"
              type="donut"
              data={statusData}
            />
          </div>

          <DataTableCard
            title="Recent bookings"
            emptyText="No bookings yet. Browse tutors to book your first session."
            columns={[
              { key: "tutorName", header: "Tutor", render: (row) => row.tutorName || "—" },
              { key: "subject", header: "Subject", render: (row) => row.subject || "—" },
              { key: "date", header: "Date", render: (row) => (row.date ? new Date(row.date).toLocaleString() : "—") },
              { key: "mode", header: "Mode" },
              { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
            ]}
            data={recentBookings}
          />

          {bookings.length === 0 && (
            <EmptyState
              title="No bookings yet"
              description="Book a tutor to see your sessions here."
              actionLabel="Browse tutors"
              actionHref="/tutors"
            />
          )}
        </>
      )}
    </div>
  );
}
