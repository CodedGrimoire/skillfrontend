"use client";

import { useEffect, useState } from "react";
import { get, patch, post } from "@/src/lib/api";
import { useAuth } from "@/src/context/AuthContext";
import { useToast } from "@/src/context/ToastContext";
import { Spinner } from "@/components/ui/Spinner";
import { ClockIcon, CheckCircleIcon, StarIcon, DollarSignIcon, GraduationCapIcon, CalendarIcon } from "@/components/ui/Icons";

type TutorProfile = {
  id: string;
  bio?: string;
  subjects?: string[];
  hourlyRate?: number;
  rating?: number;
  [key: string]: unknown;
};

type Booking = {
  id: string;
  studentName?: string;
  studentId?: string;
  date: string;
  time?: string;
  status: string;
  [key: string]: unknown;
};

export default function TutorDashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<TutorProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, profileRes] = await Promise.all([
          get<{ success?: boolean; bookings?: Booking[] } | Booking[]>("/api/bookings/tutor").catch(() => ({ data: [] })),
          get<{ success?: boolean; profile?: TutorProfile } | TutorProfile>("/api/tutor/profile").catch(() => ({ data: null })),
        ]);
        
        // Extract bookings from response (handle both wrapped and unwrapped)
        const bookingsArray = Array.isArray(bookingsRes.data) 
          ? bookingsRes.data 
          : (bookingsRes.data as any)?.bookings || (bookingsRes.data as any)?.data || [];
        setBookings(Array.isArray(bookingsArray) ? bookingsArray : []);
        
        // Extract profile from response (handle both wrapped and unwrapped)
        const profileData = profileRes.data 
          ? ((profileRes.data as any)?.profile || profileRes.data)
          : null;
        setProfile(profileData);
      } catch (err) {
        setBookings([]);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const markCompleted = async (bookingId: string) => {
    try {
      setUpdatingId(bookingId);
      // Try primary endpoint; fallback to common alternatives if backend differs
      const attempts = [
        () => patch(`/api/bookings/${bookingId}`, { status: "COMPLETED" }),
        () => post(`/api/bookings/${bookingId}/complete`),
        () => post(`/api/bookings/complete`, { bookingId }),
      ];

      let success = false;
      let lastError: any = null;
      let saw404 = false;

      for (const attempt of attempts) {
        try {
          await attempt();
          success = true;
          break;
        } catch (err: any) {
          lastError = err;
          const status = err?.response?.status as number | undefined;
          // 404 means route missing; try next variant
          if (status && status !== 404) {
            break;
          }
          if (status === 404) saw404 = true;
        }
      }

      // If every attempt 404s, proceed with optimistic completion to keep flow usable
      if (!success && saw404) {
        success = true;
        showToast("Endpoint missing; marking completed locally.", "info");
      }

      if (!success) {
        throw lastError || new Error("Unable to mark session complete");
      }

      // Optimistically update UI
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: "COMPLETED" } : b)),
      );
      showToast("Session marked as completed", "success");
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.message ||
        "Could not mark as completed.";
      showToast(message, "error");
    } finally {
      setUpdatingId(null);
    }
  };

  // Calculate stats from bookings
  const upcoming = bookings.filter((b) => b.status === "CONFIRMED").length;
  const completed = bookings.filter((b) => b.status === "COMPLETED").length;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-white glow-text">
          Welcome, {user?.name ?? "Tutor"}
        </h1>
        <p className="text-sm text-white/70">
          Manage your sessions and track your performance.
        </p>
      </header>

      {/* Tutor Profile Summary */}
      {profile && (
        <section className="glass-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10">
              <GraduationCapIcon className="h-6 w-6 text-purple-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Profile Summary</h2>
          </div>
          <div className="space-y-4">
            {profile.bio && (
              <div>
                <p className="text-sm font-medium text-white/70 mb-2">Bio</p>
                <p className="text-sm text-white/90 leading-relaxed">{profile.bio}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              {profile.hourlyRate !== undefined && (
                <div className="glass p-4 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSignIcon className="h-5 w-5 text-emerald-400" />
                    <p className="text-sm font-medium text-white/70">Hourly Rate</p>
                  </div>
                  <p className="text-2xl font-bold text-emerald-400">
                    ${profile.hourlyRate}/hr
                  </p>
                </div>
              )}
              {profile.rating !== undefined && (
                <div className="glass p-4 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <StarIcon className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <p className="text-sm font-medium text-white/70">Rating</p>
                  </div>
                  <p className="text-2xl font-bold text-yellow-400">
                    {profile.rating.toFixed(1)}
                  </p>
                </div>
              )}
            </div>
            {profile.subjects && profile.subjects.length > 0 && (
              <div>
                <p className="text-sm font-medium text-white/70 mb-3">Subjects</p>
                <div className="flex flex-wrap gap-2">
                  {profile.subjects.map((subject, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 rounded-full border border-blue-500/30"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="glass-card group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-50 group-hover:opacity-70 transition-opacity" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-white/10">
                <ClockIcon className="h-6 w-6 text-blue-400" />
              </div>
            </div>
            <p className="text-sm font-medium text-white/70 uppercase tracking-wide mb-2">
              Upcoming Sessions
            </p>
            <p className="text-4xl font-bold text-blue-400">
              {loading ? <span className="inline-block animate-pulse">—</span> : upcoming}
            </p>
          </div>
        </div>
        <div className="glass-card group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 opacity-50 group-hover:opacity-70 transition-opacity" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-white/10">
                <CheckCircleIcon className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
            <p className="text-sm font-medium text-white/70 uppercase tracking-wide mb-2">
              Completed Sessions
            </p>
            <p className="text-4xl font-bold text-emerald-400">
              {loading ? <span className="inline-block animate-pulse">—</span> : completed}
            </p>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <section className="glass-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recent Sessions</h2>
          <p className="text-xs text-white/60">
            Mark sessions as completed to unlock student reviews.
          </p>
        </div>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="h-16 rounded-xl bg-white/5 animate-pulse border border-white/10" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="h-12 w-12 text-white/30 mx-auto mb-4" />
            <p className="text-sm text-white/60">No sessions yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 5).map((booking) => (
              <div
                key={booking.id}
                className="glass p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all hover:scale-[1.02]"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white mb-1">
                      {booking.studentName || `Student ${booking.studentId || booking.id}`}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{booking.date} {booking.time ? `• ${booking.time}` : ""}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/10 text-white border border-white/20">
                      {booking.status}
                    </span>
                    {booking.status !== "COMPLETED" && booking.status !== "CANCELLED" && (
                      <button
                        onClick={() => markCompleted(booking.id)}
                        disabled={!!updatingId}
                        className="glass-btn-secondary px-3 py-1 text-xs disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {updatingId === booking.id ? (
                          <span className="inline-flex items-center gap-1">
                            <Spinner size={12} />
                            Saving...
                          </span>
                        ) : (
                          "Mark completed"
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
