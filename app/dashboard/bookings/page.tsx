"use client";

import { useEffect, useState } from "react";
import { get, post } from "@/src/lib/api";
import { useToast } from "@/src/context/ToastContext";
import { Spinner } from "@/components/ui/Spinner";

type Booking = {
  id: string;
  tutorName: string;
  date: string;
  time: string;
  status: "CONFIRMED" | "COMPLETED" | "CANCELLED";
  tutorId: string;
};

export default function StudentBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalBooking, setModalBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchBookings = async () => {
      setError(null);
      try {
        const res = await get<{ success?: boolean; bookings?: Booking[] } | Booking[]>("/api/bookings/my");
        // Handle both wrapped and unwrapped responses
        const bookingsArray = Array.isArray(res.data) 
          ? res.data 
          : (res.data as any)?.bookings || (res.data as any)?.data || [];
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
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800">
                  {b.status}
                </span>
                {b.status === "COMPLETED" && (
                  <button
                    onClick={() => {
                      setModalBooking(b);
                      setRating(5);
                      setComment("");
                      setSubmitError(null);
                    }}
                    className="text-xs font-semibold text-slate-700 underline underline-offset-4"
                  >
                    Leave review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {modalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-900">
              Review {modalBooking.tutorName}
            </h2>
            <form
              className="mt-4 space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                setSubmitError(null);
                try {
                  setSubmitting(true);
                  await post("/api/reviews", {
                    tutorId: modalBooking.tutorId,
                    bookingId: modalBooking.id,
                    rating,
                    comment,
                  });
                  setModalBooking(null);
                  showToast("Review submitted", "success");
                } catch (err) {
                  setSubmitError("Failed to submit review. Please try again.");
                  showToast("Review failed", "error");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-inner outline-none transition focus:border-slate-400 focus:bg-slate-50"
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>
                      {r} Stars
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800">Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-inner outline-none transition focus:border-slate-400 focus:bg-slate-50"
                  placeholder="Share your learning experience..."
                />
              </div>
              {submitError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {submitError}
                </div>
              )}
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalBooking(null)}
                  className="text-sm font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <span className="inline-flex items-center gap-2">
                      <Spinner size={14} />
                      Submitting...
                    </span>
                  ) : (
                    "Submit review"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
