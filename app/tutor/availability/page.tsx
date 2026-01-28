"use client";

import { useEffect, useState } from "react";
import { get, post } from "@/src/lib/api";

type DaySlots = {
  day: string;
  slots: string[];
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function TutorAvailabilityPage() {
  const [availability, setAvailability] = useState<DaySlots[]>([]);
  const [newSlot, setNewSlot] = useState({ day: "Mon", time: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await get<DaySlots[]>("/api/tutor/availability");
        setAvailability(res.data);
      } catch (err) {
        setAvailability([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailability();
  }, []);

  const addSlot = () => {
    if (!newSlot.time) return;
    setAvailability((prev) => {
      const copy = [...prev];
      const idx = copy.findIndex((d) => d.day === newSlot.day);
      if (idx >= 0) {
        copy[idx] = {
          ...copy[idx],
          slots: Array.from(new Set([...copy[idx].slots, newSlot.time])),
        };
      } else {
        copy.push({ day: newSlot.day, slots: [newSlot.time] });
      }
      return copy;
    });
    setNewSlot({ ...newSlot, time: "" });
  };

  const saveAvailability = async () => {
    setMessage(null);
    try {
      setSaving(true);
      await post("/api/tutor/availability", availability);
      setMessage("Availability saved.");
    } catch (err) {
      setMessage("Failed to save availability.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">Availability</h1>
      {loading ? (
        <div className="h-44 rounded-xl bg-slate-200 animate-pulse" />
      ) : (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-slate-800">Day</label>
              <select
                value={newSlot.day}
                onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-inner outline-none transition focus:border-slate-400 focus:bg-slate-50"
              >
                {days.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-slate-800">Time</label>
              <input
                value={newSlot.time}
                onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
                placeholder="e.g., 10:00 AM - 11:00 AM"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-inner outline-none transition focus:border-slate-400 focus:bg-slate-50"
              />
            </div>
            <button
              type="button"
              onClick={addSlot}
              className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              Add slot
            </button>
          </div>

          <div className="space-y-3">
            {availability.length === 0 ? (
              <p className="text-sm text-slate-600">No slots added yet.</p>
            ) : (
              availability.map((day) => (
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
            )}
          </div>

          {message && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              {message}
            </div>
          )}
          <button
            type="button"
            disabled={saving}
            onClick={saveAvailability}
            className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save availability"}
          </button>
        </div>
      )}
    </div>
  );
}
