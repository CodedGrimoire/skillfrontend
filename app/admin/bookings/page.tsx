"use client";

import { useEffect, useMemo, useState } from "react";
import { get } from "@/src/lib/api";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { LoadingGrid } from "@/components/layout/LoadingGrid";
import { EmptyState } from "@/components/layout/EmptyState";

type Booking = {
  id: string;
  studentName?: string;
  tutorName?: string;
  subject?: string;
  date?: string;
  status?: string;
  mode?: string;
};

const statusFilters = ["ALL", "CONFIRMED", "COMPLETED", "PENDING", "CANCELLED"];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState<string>("ALL");

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await get<Booking[] | { bookings?: Booking[] }>("/api/admin/bookings");
        const data = Array.isArray(res.data) ? res.data : (res.data as any)?.bookings || [];
        setBookings(data);
      } catch (err) {
        setBookings([]);
        setError("Unable to load bookings right now.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filtered = useMemo(() => {
    if (activeStatus === "ALL") return bookings;
    return bookings.filter((b) => (b.status || "").toUpperCase() === activeStatus);
  }, [bookings, activeStatus]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Bookings</h1>
          <p className="text-sm text-white/70">Platform-wide session oversight.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setActiveStatus(s)}
              className={`rounded-full border px-3 py-1 text-xs transition ${activeStatus === s ? "border-purple-400/70 bg-purple-500/10 text-white" : "border-white/10 bg-white/5 text-white/70 hover:border-white/30"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingGrid items={6} columns={2} />
      ) : error ? (
        <div className="glass-card px-4 py-3 text-sm text-rose-300 border-rose-500/30 bg-rose-500/10">{error}</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No bookings"
          description="No bookings match this filter."
          actionLabel="Reset filters"
          actionHref="#"
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c1027]">
          <div className="grid grid-cols-6 gap-3 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/60">
            <span>Student</span>
            <span>Tutor</span>
            <span>Subject</span>
            <span>Date</span>
            <span>Mode</span>
            <span>Status</span>
          </div>
          <div className="divide-y divide-white/5">
            {filtered.map((b) => (
              <div key={b.id} className="grid grid-cols-6 gap-3 px-4 py-3 text-sm text-white/80">
                <div className="font-medium text-white">{b.studentName || "Student"}</div>
                <div className="text-white/80">{b.tutorName || "Tutor"}</div>
                <div className="text-white/70 truncate">{b.subject || "—"}</div>
                <div className="text-white/70">{b.date ? new Date(b.date).toLocaleString() : "—"}</div>
                <div className="text-white/70">{b.mode || "Online"}</div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={b.status || "PENDING"} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass-card px-4 py-3 text-xs text-white/60">
        Booking moderation (cancel/override) requires backend support; actions are disabled until available.
      </div>
    </div>
  );
}
