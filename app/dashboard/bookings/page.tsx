"use client";

import { useEffect, useMemo, useState } from "react";
import { get } from "@/src/lib/api";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { LoadingGrid } from "@/components/layout/LoadingGrid";
import { EmptyState } from "@/components/layout/EmptyState";

const filters = ["ALL", "UPCOMING", "COMPLETED", "CANCELLED", "PENDING"] as const;
type Filter = typeof filters[number];

type Booking = {
  id: string;
  status: string;
  date: string;
  tutorName?: string;
  subject?: string;
  mode?: string;
};

export default function StudentBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<Filter>("ALL");

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
        setError("Could not load bookings.");
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    if (activeFilter === "ALL") return bookings;
    if (activeFilter === "UPCOMING") return bookings.filter((b) => ["UPCOMING", "CONFIRMED"].includes(b.status));
    return bookings.filter((b) => b.status === activeFilter);
  }, [activeFilter, bookings]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 rounded-full text-xs font-semibold border ${
              activeFilter === f ? "border-white/40 text-white" : "border-white/15 text-white/70 hover:text-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingGrid items={6} columns={3} />
      ) : error ? (
        <div className="glass-card px-4 py-3 text-sm text-rose-300 border-rose-500/30 bg-rose-500/10">{error}</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No bookings"
          description="Try another filter or book your next session."
          actionLabel="Browse tutors"
          actionHref="/tutors"
        />
      ) : (
        <div className="grid gap-3">
          {filtered.map((b) => (
            <div key={b.id} className="glass-card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">{b.tutorName || "Tutor"}</p>
                <p className="text-xs text-white/60">{b.subject || "Subject"}</p>
                <p className="text-xs text-white/60">{b.date ? new Date(b.date).toLocaleString() : ""}</p>
              </div>
              <div className="flex items-center gap-3 sm:text-right">
                <div className="text-xs text-white/60">{b.mode || "Online"}</div>
                <StatusBadge status={b.status} />
                <a href={`/tutors/${b.id}`} className="glass-btn-secondary text-xs">View Tutor</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
