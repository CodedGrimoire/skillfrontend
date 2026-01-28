"use client";

import { useEffect, useState } from "react";
import { get } from "@/src/lib/api";

type Booking = {
  id: string;
  tutorName: string;
  date: string;
  time: string;
  status: "CONFIRMED" | "COMPLETED" | "CANCELLED";
};

export default function StudentBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setError(null);
      try {
        const res = await get<Booking[]>("/api/bookings");
        setBookings(res.data);
      } catch (err) {
        setError("Unable to load bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">My Bookings</h1>
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="h-16 rounded-xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-700">
          No bookings yet. Book a tutor to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">{b.tutorName}</p>
                <p className="text-sm text-slate-600">
                  {b.date} • {b.time}
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800">
                {b.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
