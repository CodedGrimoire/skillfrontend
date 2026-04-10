"use client";

import { useEffect, useMemo, useState } from "react";
import { get } from "@/src/lib/api";
import { OverviewCard } from "@/components/dashboard/OverviewCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { DataTableCard } from "@/components/dashboard/DataTableCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { LoadingGrid } from "@/components/layout/LoadingGrid";
import { EmptyState } from "@/components/layout/EmptyState";

type User = {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  createdAt?: string;
};

type Booking = {
  id: string;
  studentName?: string;
  tutorName?: string;
  subject?: string;
  date?: string;
  status?: string;
};

type Category = {
  id: string;
  name: string;
  usageCount?: number;
};

export default function AdminOverviewPage() {
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

        const usersData = Array.isArray(usersRes.data) ? usersRes.data : (usersRes.data as any)?.users || [];
        const bookingsData = Array.isArray(bookingsRes.data) ? bookingsRes.data : (bookingsRes.data as any)?.bookings || [];
        const categoriesData = Array.isArray(categoriesRes.data) ? categoriesRes.data : (categoriesRes.data as any)?.categories || [];

        setUsers(usersData);
        setBookings(bookingsData);
        setCategories(categoriesData);
      } catch (err) {
        setError("Unable to load admin overview right now.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const totalTutors = users.filter((u) => (u.role || "").toUpperCase() === "TUTOR").length;
    const totalStudents = users.filter((u) => (u.role || "").toUpperCase() === "STUDENT").length;
    const totalBookings = bookings.length;
    const totalCategories = categories.length;
    return { totalUsers, totalTutors, totalStudents, totalBookings, totalCategories };
  }, [users, bookings, categories]);

  const bookingsByMonth = useMemo(() => {
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

  const roleMix = useMemo(() => {
    const roles: Record<string, number> = {};
    users.forEach((u) => {
      const key = (u.role || "UNKNOWN").toUpperCase();
      roles[key] = (roles[key] || 0) + 1;
    });
    return Object.entries(roles).map(([label, value]) => ({ label, value }));
  }, [users]);

  const recentActivity = useMemo(() => {
    return bookings
      .slice()
      .sort((a, b) => (new Date(b.date || "").getTime() || 0) - (new Date(a.date || "").getTime() || 0))
      .slice(0, 8);
  }, [bookings]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <OverviewCard title="Users" value={`${stats.totalUsers}`} sublabel="All roles" />
        <OverviewCard title="Students" value={`${stats.totalStudents}`} sublabel="Learners" accent="from-emerald-500/20 to-teal-500/20" />
        <OverviewCard title="Tutors" value={`${stats.totalTutors}`} sublabel="Experts" accent="from-purple-500/20 to-pink-500/20" />
        <OverviewCard title="Bookings" value={`${stats.totalBookings}`} sublabel="Total sessions" accent="from-blue-500/20 to-cyan-500/20" />
        <OverviewCard title="Categories" value={`${stats.totalCategories}`} sublabel="Active subjects" accent="from-amber-500/20 to-orange-500/20" />
      </div>

      {loading ? (
        <LoadingGrid items={6} columns={3} />
      ) : error ? (
        <div className="glass-card px-4 py-3 text-sm text-rose-300 border-rose-500/30 bg-rose-500/10">{error}</div>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard title="Bookings trend" subtitle="By month" type="bar" data={bookingsByMonth} />
            <ChartCard title="User roles" subtitle="Distribution" type="donut" data={roleMix} />
          </div>

          <DataTableCard
            title="Recent activity"
            emptyText="No bookings yet."
            columns={[
              { key: "tutorName", header: "Tutor", render: (row) => row.tutorName || "Tutor" },
              { key: "studentName", header: "Student", render: (row) => row.studentName || "Student" },
              { key: "subject", header: "Subject", render: (row) => row.subject || "—" },
              { key: "date", header: "Date", render: (row) => (row.date ? new Date(row.date).toLocaleString() : "—") },
              { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status || "PENDING"} /> },
            ]}
            data={recentActivity}
          />

          {bookings.length === 0 && (
            <EmptyState
              title="No bookings yet"
              description="Bookings will appear once students start scheduling with tutors."
              actionLabel="Explore tutors"
              actionHref="/tutors"
            />
          )}
        </>
      )}
    </div>
  );
}
