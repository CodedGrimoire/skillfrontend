"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { get, post } from "@/src/lib/api";
import { useAuth } from "@/src/context/AuthContext";
import { useToast } from "@/src/context/ToastContext";
import { Spinner } from "@/components/ui/Spinner";
import { StarIcon } from "@/components/ui/Icons";

type TutorDetail = {
  id: string;
  name: string;
  bio?: string;
  skills?: string[];
  pricePerHour?: number;
  rating?: number;
  averageRating?: number;
  availability?: string | { day: string; slots: string[] }[];
};

type Review = {
  id: string;
  author: string;
  comment?: string;
  rating: number;
  student?: {
    name: string;
  };
};

export default function TutorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [tutor, setTutor] = useState<TutorDetail | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const isStudent = user?.role === "STUDENT";

  useEffect(() => {
    const fetchTutor = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await get<{ success?: boolean; tutor?: TutorDetail } | TutorDetail>(`/api/tutors/${id}`);
        // Handle both wrapped and unwrapped responses
        const tutorData = (res.data as any)?.tutor || res.data;
        
        // Normalize skills to always be an array
        const normalizeSkills = (skills: any): string[] => {
          if (!skills) return [];
          if (Array.isArray(skills)) return skills.filter(Boolean);
          if (typeof skills === 'string') {
            // Handle comma-separated string
            return skills.split(',').map(s => s.trim()).filter(Boolean);
          }
          return [];
        };

        const rawSkills = tutorData.skills || tutorData.tutorProfile?.subjects || tutorData.tutorProfile?.skills;
        
        // Map backend response structure to frontend format
        const mappedTutor: TutorDetail = {
          id: tutorData.id,
          name: tutorData.name,
          bio: tutorData.bio || tutorData.tutorProfile?.bio,
          skills: normalizeSkills(rawSkills),
          pricePerHour: tutorData.pricePerHour || tutorData.tutorProfile?.hourlyRate,
          rating: tutorData.rating || tutorData.tutorProfile?.rating,
          averageRating: tutorData.averageRating || tutorData.rating || tutorData.tutorProfile?.rating,
          availability: tutorData.availability || tutorData.tutorProfile?.availability,
        };
        
        setTutor(mappedTutor);
      } catch (err) {
        console.error("Error fetching tutor:", err);
        setError("Unable to load tutor details.");
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      if (!id) return;
      setReviewsLoading(true);
      try {
        const res = await get<{ success?: boolean; reviews?: Review[] } | Review[]>(`/api/reviews/tutor/${id}`);
        // Handle both wrapped and unwrapped responses
        const reviewsArray = Array.isArray(res.data) 
          ? res.data 
          : (res.data as any)?.reviews || [];
        
        // Map reviews to frontend format
        const mappedReviews: Review[] = reviewsArray.map((review: any) => ({
          id: review.id,
          author: review.student?.name || review.author || "Anonymous",
          comment: review.comment,
          rating: review.rating,
          student: review.student,
        }));
        
        setReviews(mappedReviews);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchTutor();
    fetchReviews();
  }, [id]);

  // Parse availability into structured format
  const parsedAvailability = useMemo(() => {
    if (!tutor?.availability) return null;
    
    // Handle string format (availability is stored as a string)
    if (typeof tutor.availability === 'string') {
      try {
        const parsed = JSON.parse(tutor.availability);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch {
        // If not JSON, return null (will display as plain text)
        return null;
      }
    }
    
    // Handle array format
    if (Array.isArray(tutor.availability)) {
      return tutor.availability;
    }
    
    return null;
  }, [tutor]);

  const availabilitySlots = useMemo(() => {
    const normalizeTo24h = (slot: string) => {
      const trimmed = slot.trim();
      const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (!match) return trimmed; // assume already 24h (HH:mm) or ISO-compatible
      let [_, h, m, meridiem] = match;
      let hour = parseInt(h, 10);
      if (meridiem.toUpperCase() === "PM" && hour !== 12) hour += 12;
      if (meridiem.toUpperCase() === "AM" && hour === 12) hour = 0;
      return `${hour.toString().padStart(2, "0")}:${m}`;
    };

    if (!parsedAvailability) {
      // Fallback: offer standard working hours if no structured availability is provided
      const defaultHours = Array.from({ length: 9 }, (_, i) => 9 + i); // 9am - 5pm
      return defaultHours.map((hour) => {
        const value = `${hour.toString().padStart(2, "0")}:00`;
        return { value, label: value };
      });
    }

    return parsedAvailability.flatMap((day: any) =>
      (day.slots || []).map((slot: string) => ({
        value: normalizeTo24h(slot), // expected to be HH:mm or ISO-compliant time fragment
        label: `${day.day ? day.day + " " : ""}${slot}`,
      }))
    );
  }, [parsedAvailability]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);
    setBookingSuccess(null);

    if (!date || !time) {
      setBookingError("Please select date and time.");
      return;
    }

    try {
      setBookingLoading(true);
      // Combine date and time into ISO string format
      const dateTime = new Date(`${date}T${time}`).toISOString();
      
      await post("/api/bookings", {
        tutorId: id,
        dateTime,
      });
      setBookingSuccess("Session booked! Check your dashboard for details.");
      showToast("Booking confirmed", "success");
      setDate("");
      setTime("");
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || "Booking failed. Please try again.";
      setBookingError(errorMessage);
      showToast("Booking failed", "error");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <Skeleton />;
  if (error || !tutor)
    return (
      <div className="glass-card px-6 py-4 border-rose-500/30 bg-rose-500/10">
        <p className="text-sm text-rose-300">{error ?? "Tutor not found."}</p>
      </div>
    );

  return (
    <div className="space-y-8">
      <section className="glass-card p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-white/20 flex items-center justify-center text-white text-2xl font-bold">
              {tutor.name?.[0]?.toUpperCase() || "T"}
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white glow-text">{tutor.name}</h1>
              <p className="text-sm text-white/70">
                {Array.isArray(tutor.skills) && tutor.skills.length > 0
                  ? tutor.skills.join(" • ")
                  : "Multidisciplinary Tutor"}
              </p>
              <div className="flex items-center gap-3 text-sm">
                {tutor.averageRating ?? tutor.rating ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
                    {(tutor.averageRating ?? tutor.rating)!.toFixed(1)}{" "}
                    <StarIcon className="h-3 w-3 fill-emerald-300" />
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 border border-blue-500/30">
                    New
                  </span>
                )}
                <span className="text-white/80">
                  {tutor.pricePerHour ? `$${tutor.pricePerHour}/hr` : "Rate on request"}
                </span>
              </div>
            </div>
          </div>
          {isStudent && (
            <a
              href="#book"
              className="glass-btn px-6 py-3"
            >
              Book Session
            </a>
          )}
        </div>

        {tutor.bio && (
          <p className="mt-6 text-sm leading-relaxed text-white/80">{tutor.bio}</p>
        )}
      </section>

      {/* Skills */}
      {Array.isArray(tutor.skills) && tutor.skills.length > 0 && (
        <section className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-4">Skills & Expertise</h2>
          <div className="flex flex-wrap gap-2">
            {tutor.skills.map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 rounded-full border border-blue-500/30"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Availability */}
      <section className="glass-card p-6">
        <h2 className="text-xl font-bold text-white mb-4">Availability</h2>
        <div className="space-y-3">
          {tutor.availability ? (
            parsedAvailability ? (
              // Display structured availability (array format)
              parsedAvailability.map((day: any, idx: number) => (
                <div
                  key={day.day || idx}
                  className="glass p-4 rounded-xl border border-white/10"
                >
                  <span className="font-semibold text-white mb-3 block">{day.day || 'Available'}</span>
                  <div className="flex flex-wrap gap-2">
                    {(day.slots || []).map((slot: string) => (
                      <span
                        key={slot}
                        className="px-3 py-1 text-xs font-semibold text-white/80 bg-white/10 rounded-full border border-white/20"
                      >
                        {slot}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : typeof tutor.availability === 'string' ? (
              // Display plain text availability
              <div className="glass p-4 rounded-xl border border-white/10">
                <p className="text-sm text-white/80 whitespace-pre-wrap">{tutor.availability}</p>
              </div>
            ) : null
          ) : (
            <p className="text-sm text-white/60">No availability listed yet.</p>
          )}
        </div>
      </section>

      {/* Reviews */}
      <section className="glass-card p-6">
        <h2 className="text-xl font-bold text-white mb-4">Reviews</h2>
        {reviewsLoading ? (
          <div className="space-y-3 animate-pulse">
            {Array.from({ length: 2 }).map((_, idx) => (
              <div key={idx} className="glass p-4 rounded-xl border border-white/10 h-20" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {reviews && reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="glass p-4 rounded-xl border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white">{review.author}</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-300 border border-emerald-500/30">
                      {review.rating} <StarIcon className="h-3 w-3 fill-emerald-300" />
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-white/80">{review.comment}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-white/60">No reviews yet.</p>
            )}
          </div>
        )}
      </section>

      {/* Booking */}
      <section
        id="book"
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Book a Session</h2>
          {!isStudent && (
            <span className="text-xs font-semibold text-white/50">
              Login as a student to book
            </span>
          )}
        </div>
        <form
          onSubmit={handleBooking}
          className="grid gap-4 md:grid-cols-2"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="glass-input w-full"
              disabled={!isStudent}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Time Slot</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="glass-input w-full"
              disabled={!isStudent}
              required
            >
              <option value="">Select time</option>
              {availabilitySlots.map((slot) => (
                <option key={slot.value} value={slot.value}>
                  {slot.label}
                </option>
              ))}
            </select>
            {!parsedAvailability && (
              <p className="text-xs text-amber-200/80">
                Tutor availability not set; showing standard hours (09:00-17:00).
              </p>
            )}
          </div>

          {bookingError && (
            <div className="md:col-span-2 glass-card px-4 py-3 border-rose-500/30 bg-rose-500/10">
              <p className="text-sm text-rose-300">{bookingError}</p>
            </div>
          )}
          {bookingSuccess && (
            <div className="md:col-span-2 glass-card px-4 py-3 border-emerald-500/30 bg-emerald-500/10">
              <p className="text-sm text-emerald-300">{bookingSuccess}</p>
            </div>
          )}

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={!isStudent || bookingLoading}
              className="glass-btn w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {bookingLoading ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner size={14} />
                  Booking...
                </span>
              ) : isStudent ? (
                "Book Session"
              ) : (
                "Login as student"
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-32 glass rounded-3xl border border-white/10" />
      <div className="h-24 glass rounded-2xl border border-white/10" />
      <div className="h-24 glass rounded-2xl border border-white/10" />
      <div className="h-40 glass rounded-2xl border border-white/10" />
    </div>
  );
}
