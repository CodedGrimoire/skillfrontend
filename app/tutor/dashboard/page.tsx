"use client";

import { useEffect, useMemo, useState } from "react";
import { get } from "@/src/lib/api";
import { useAuth } from "@/src/context/AuthContext";
import { OverviewCard } from "@/components/dashboard/OverviewCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { DataTableCard } from "@/components/dashboard/DataTableCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { LoadingGrid } from "@/components/layout/LoadingGrid";
import { EmptyState } from "@/components/layout/EmptyState";

const pageSize = 6;

type TutorProfile = {
  id: string;
  bio?: string;
  subjects?: string[];
  hourlyRate?: number;
  rating?: number;
  reviewCount?: number;
  mode?: string;
};

type Booking = {
  id: string;
  studentName?: string;
  studentId?: string;
  subject?: string;
  date: string;
  status: string;
  mode?: string;
};

export default function TutorDashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<TutorProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [bookingsRes, profileRes] = await Promise.all([
          get<{ success?: boolean; bookings?: Booking[] } | Booking[]>("/api/bookings/tutor").catch(() => ({ data: [] })),
          get<{ success?: boolean; profile?: TutorProfile } | TutorProfile>("/api/tutor/profile").catch(() => ({ data: null })),
        ]);

        const bookingsArray = Array.isArray(bookingsRes.data)
          ? bookingsRes.data
          : (bookingsRes.data as any)?.bookings || (bookingsRes.data as any)?.data || [];
        const normalized = (Array.isArray(bookingsArray) ? bookingsArray : []).map((b: any) => ({
          id: b.id,
          status: b.status || "PENDING",
          date: b.date || b.startTime || b.createdAt,
          studentName: b.studentName || b.student?.name || b.student_name,
          studentId: b.studentId || b.student_id || b.student?.id,
          subject: b.subject || b.tutor?.subject,
          mode: b.mode || b.sessionMode || "Online",
        }));
        setBookings(normalized);

        const profileData = profileRes.data ? ((profileRes.data as any)?.profile || profileRes.data) : null;
        setProfile(profileData);
      } catch (err) {
        setError("Could not load tutor dashboard data.");
        setBookings([]);
        setProfile(null);
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
    const averageRating = profile?.rating ? profile.rating.toFixed(1) : "—";
    const reviews = profile?.reviewCount ?? 0;
    return { upcoming, completed, pending, averageRating, reviews };
  }, [bookings, profile]);

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

  const recentSessions = bookings
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
          <div className="grid gap-4 sm:grid-cols-4">
            <OverviewCard title="Upcoming" value={`${stats.upcoming}`} sublabel="Confirmed / upcoming" />
            <OverviewCard title="Completed" value={`${stats.completed}`} sublabel="Sessions finished" accent="from-emerald-500/20 to-teal-500/20" />
            <OverviewCard title="Pending" value={`${stats.pending}`} sublabel="Awaiting action" accent="from-amber-500/20 to-orange-500/20" />
            <OverviewCard title="Rating" value={`${stats.averageRating}`} sublabel={`${stats.reviews} reviews`} accent="from-yellow-500/20 to-amber-500/20" />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard title="Sessions by month" subtitle="Recent activity" type="bar" data={monthlyData} />
            <ChartCard title="Status mix" subtitle="Pipeline" type="donut" data={statusData} />
          </div>

          <DataTableCard
            title="Recent sessions"
            emptyText="No sessions yet."
            columns={[
              { key: "studentName", header: "Student", render: (row) => row.studentName || "Student" },
              { key: "subject", header: "Subject", render: (row) => row.subject || "Subject" },
              { key: "date", header: "Date", render: (row) => (row.date ? new Date(row.date).toLocaleString() : "—") },
              { key: "mode", header: "Mode", render: (row) => row.mode || "Online" },
              { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
            ]}
            data={recentSessions}
          />

          {bookings.length === 0 && (
            <EmptyState
              title="No sessions yet"
              description="Once students book you, sessions will appear here."
              actionLabel="View profile"
              actionHref="/tutor/profile"
            />
          )}
        </>
      )}
    </div>
  );
}
