"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { get, post } from "@/src/lib/api";
import { useAuth } from "@/src/context/AuthContext";

type TutorDetail = {
  id: string;
  name: string;
  bio?: string;
  skills?: string[];
  pricePerHour?: number;
  rating?: number;
  availability?: { day: string; slots: string[] }[];
  reviews?: { id: string; author: string; comment: string; rating: number }[];
};

export default function TutorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [tutor, setTutor] = useState<TutorDetail | null>(null);
  const [loading, setLoading] = useState(true);
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
        const res = await get<TutorDetail>(`/api/tutors/${id}`);
        setTutor(res.data);
      } catch (err) {
        setError("Unable to load tutor details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTutor();
  }, [id]);

  const availabilitySlots = useMemo(
    () =>
      tutor?.availability?.flatMap((day) =>
        day.slots.map((slot) => `${day.day} ${slot}`),
      ) ?? [],
    [tutor],
  );

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
      await post("/api/bookings", {
        tutorId: id,
        date,
        time,
      });
      setBookingSuccess("Session booked! Check your dashboard for details.");
      setDate("");
      setTime("");
    } catch (err) {
      setBookingError("Booking failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <Skeleton />;
  if (error || !tutor)
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {error ?? "Tutor not found."}
      </div>
    );

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-slate-200 to-slate-100" />
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-slate-900">{tutor.name}</h1>
              <p className="text-sm text-slate-600">
                {tutor.skills?.join(" • ") || "Multidisciplinary Tutor"}
              </p>
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {tutor.rating ? `${tutor.rating.toFixed(1)} ★` : "New"}
                </span>
                <span>
                  {tutor.pricePerHour ? `$${tutor.pricePerHour}/hr` : "Rate on request"}
                </span>
              </div>
            </div>
          </div>
          {isStudent && (
            <a
              href="#book"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              Book Session
            </a>
          )}
        </div>

        {tutor.bio && (
          <p className="mt-6 text-sm leading-relaxed text-slate-700">{tutor.bio}</p>
        )}
      </section>

      {/* Skills */}
      {tutor.skills && tutor.skills.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Skills</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {tutor.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Availability */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Availability</h2>
        <div className="mt-4 space-y-3">
          {tutor.availability && tutor.availability.length > 0 ? (
            tutor.availability.map((day) => (
              <div
                key={day.day}
                className="flex flex-wrap items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700"
              >
                <span className="font-semibold text-slate-800">{day.day}</span>
                <div className="flex flex-wrap gap-2">
                  {day.slots.map((slot) => (
                    <span
                      key={slot}
                      className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200"
                    >
                      {slot}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-600">No availability listed yet.</p>
          )}
        </div>
      </section>

      {/* Reviews */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Reviews</h2>
        <div className="mt-4 space-y-3">
          {tutor.reviews && tutor.reviews.length > 0 ? (
            tutor.reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
                  <span>{review.author}</span>
                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                    {review.rating} ★
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-700">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-600">No reviews yet.</p>
          )}
        </div>
      </section>

      {/* Booking */}
      <section
        id="book"
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Book a session</h2>
          {!isStudent && (
            <span className="text-xs font-semibold text-slate-500">
              Login as a student to book
            </span>
          )}
        </div>
        <form
          onSubmit={handleBooking}
          className="mt-4 grid gap-4 md:grid-cols-2"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-800">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-inner outline-none transition focus:border-slate-400 focus:bg-slate-50"
              disabled={!isStudent}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-800">Time Slot</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-inner outline-none transition focus:border-slate-400 focus:bg-slate-50"
              disabled={!isStudent}
            >
              <option value="">Select time</option>
              {availabilitySlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          {bookingError && (
            <div className="md:col-span-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {bookingError}
            </div>
          )}
          {bookingSuccess && (
            <div className="md:col-span-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {bookingSuccess}
            </div>
          )}

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={!isStudent || bookingLoading}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {bookingLoading ? "Booking..." : isStudent ? "Book Session" : "Login as student"}
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
      <div className="h-32 rounded-3xl bg-slate-200" />
      <div className="h-24 rounded-2xl bg-slate-200" />
      <div className="h-24 rounded-2xl bg-slate-200" />
      <div className="h-40 rounded-2xl bg-slate-200" />
    </div>
  );
}
