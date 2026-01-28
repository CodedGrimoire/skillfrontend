"use client";

import { useEffect, useState } from "react";
import { get } from "@/src/lib/api";

type AdminBooking = {
  id: string;
  studentName: string;
  tutorName: string;
  date: string;
  time: string;
  status: string;
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setError(null);
      try {
        const res = await get<{ success: boolean; bookings: AdminBooking[] }>("/api/admin/bookings");
        // Extract bookings array from response: { success: true, bookings: [...] }
        const bookingsArray = res.data.bookings || res.data || [];
        setBookings(Array.isArray(bookingsArray) ? bookingsArray : []);
      } catch (err) {
        setError("Unable to load bookings.");
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">All Bookings</h1>
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-12 rounded-xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-700">
          No bookings found.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-5 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <span>Student</span>
            <span>Tutor</span>
            <span>Date</span>
            <span>Status</span>
            <span>Time</span>
          </div>
          <div className="divide-y divide-slate-100">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="grid grid-cols-5 items-center px-4 py-3 text-sm text-slate-800"
              >
                <span className="font-medium text-slate-900">{b.studentName}</span>
                <span className="text-slate-700">{b.tutorName}</span>
                <span className="text-slate-600">{b.date}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800">
                  {b.status}
                </span>
                <span className="text-slate-600">{b.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
