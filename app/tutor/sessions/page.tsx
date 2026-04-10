"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { get } from "@/src/lib/api";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { LoadingGrid } from "@/components/layout/LoadingGrid";
import { EmptyState } from "@/components/layout/EmptyState";

type Session = {
  id: string;
  studentName?: string;
  subject?: string;
  date?: string;
  status: string;
  mode?: string;
};

const filters = [
  { key: "ALL", label: "All" },
  { key: "UPCOMING", label: "Upcoming" },
  { key: "COMPLETED", label: "Completed" },
  { key: "CANCELLED", label: "Cancelled" },
  { key: "PENDING", label: "Pending" },
];

export default function TutorSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("UPCOMING");

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await get<{ bookings?: Session[] } | Session[]>("/api/bookings/tutor");
        const data = Array.isArray(res.data) ? res.data : (res.data as any)?.bookings || [];
        const normalized = (Array.isArray(data) ? data : []).map((s: any) => ({
          id: s.id,
          studentName: s.studentName || s.student?.name || "Student",
          subject: s.subject || s.topic || "Session",
          date: s.date || s.startTime || s.createdAt,
          status: s.status || "PENDING",
          mode: s.mode || s.sessionMode || "Online",
        }));
        setSessions(normalized);
      } catch (err) {
        setSessions([]);
        setError("Unable to load sessions right now.");
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const filtered = useMemo(() => {
    if (activeFilter === "ALL") return sessions;
    return sessions.filter((s) => s.status?.toUpperCase() === activeFilter);
  }, [sessions, activeFilter]);

  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-white">Sessions</h1>
        <p className="text-sm text-white/70">Track upcoming and completed sessions with students.</p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              activeFilter === f.key
                ? "border-purple-400/60 bg-purple-500/10 text-white"
                : "border-white/10 bg-white/5 text-white/70 hover:border-white/30"
            }`}
          >
            {f.label}
          </button>
        ))}
        <div className="text-xs text-white/50">{filtered.length} result(s)</div>
      </div>

      {loading ? (
        <LoadingGrid items={6} columns={2} />
      ) : error ? (
        <div className="glass-card px-4 py-3 text-sm text-rose-300 border-rose-500/30 bg-rose-500/10">{error}</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No sessions match this filter"
          description="Adjust filters or check upcoming bookings."
          actionLabel="Back to dashboard"
          actionHref="/tutor/dashboard"
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c1027]">
          <div className="grid grid-cols-5 gap-3 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/60">
            <span>Student</span>
            <span>Subject</span>
            <span>Date</span>
            <span>Mode</span>
            <span>Status</span>
          </div>
          <div className="divide-y divide-white/5">
            {filtered.map((s) => (
              <div key={s.id} className="grid grid-cols-5 gap-3 px-4 py-3 text-sm text-white/80">
                <div className="font-medium text-white">{s.studentName || "Student"}</div>
                <div className="truncate text-white/80">{s.subject || "Session"}</div>
                <div className="text-white/70">{s.date ? new Date(s.date).toLocaleString() : "—"}</div>
                <div className="text-white/70">{s.mode || "Online"}</div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={s.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass-card px-4 py-3 text-sm text-white/70">
        Need to update a session or reschedule? Visit the <Link href="/contact" className="text-purple-300 hover:text-purple-200">help center</Link> or message the student directly.
      </div>
    </div>
  );
}
