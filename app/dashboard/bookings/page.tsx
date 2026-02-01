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
  sessionName?: string;
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

        const normalized = (Array.isArray(bookingsArray) ? bookingsArray : []).map((b: any) => ({
          ...b,
          tutorName:
            b.tutorName ||
            b.tutor?.name ||
            b.tutor_name ||
            b.sessionName ||
            b.title ||
            b.subject ||
            "Session",
          sessionName: b.sessionName || b.title || b.subject,
        }));

        setBookings(normalized);
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
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-white glow-text">My Bookings</h1>
        <p className="text-sm text-white/70">View and manage your tutoring sessions</p>
      </header>
      
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="glass-card p-6 h-20 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="glass-card px-6 py-4 border-rose-500/30 bg-rose-500/10">
          <p className="text-sm text-rose-300">{error}</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="glass-card px-6 py-12 text-center">
          <p className="text-sm text-white/60">No bookings yet. Book a tutor to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="glass-card p-6 hover:scale-[1.02] transition-transform"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-semibold text-white mb-1">
                    {b.sessionName || b.tutorName}
                  </p>
                  <p className="text-sm text-white/70">
                    {b.date} • {b.time}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold border ${
                    b.status === "COMPLETED"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      : b.status === "CANCELLED"
                      ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                      : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                  }`}>
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
                      className="glass-btn-secondary px-4 py-2 text-sm"
                    >
                      Leave review
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-md glass-card p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Review {modalBooking.tutorName}
            </h2>
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                setSubmitError(null);
                
                if (rating < 1 || rating > 5) {
                  setSubmitError("Please select a valid rating.");
                  return;
                }
                
                try {
                  setSubmitting(true);
                  await post("/api/reviews", {
                    tutorId: modalBooking.tutorId,
                    rating,
                    comment: comment.trim() || undefined,
                  });
                  setModalBooking(null);
                  showToast("Review submitted", "success");
                  // Refresh bookings to show updated state
                  window.location.reload();
                } catch (err: any) {
                  const errorMsg = err?.response?.data?.error || "Failed to submit review. Please try again.";
                  setSubmitError(errorMsg);
                  showToast("Review failed", "error");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="glass-input w-full"
                  required
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>
                      {r} {r === 1 ? 'Star' : 'Stars'}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90">Comment (optional)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="glass-input w-full"
                  placeholder="Share your learning experience..."
                />
              </div>
              {submitError && (
                <div className="glass-card px-4 py-3 border-rose-500/30 bg-rose-500/10">
                  <p className="text-sm text-rose-300">{submitError}</p>
                </div>
              )}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalBooking(null)}
                  className="glass-btn-secondary px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="glass-btn px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
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
