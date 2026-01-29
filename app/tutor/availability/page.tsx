"use client";

import { useEffect, useState } from "react";
import { get, put } from "@/src/lib/api";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/src/context/ToastContext";

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
  const { showToast } = useToast();

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await get<{ success?: boolean; availability?: string | DaySlots[] } | DaySlots[] | string>("/api/tutor/availability");
        // Handle different response formats
        let availabilityData: DaySlots[] = [];
        const data = (res.data as any)?.availability || res.data;
        
        if (typeof data === 'string') {
          // Parse JSON string
          try {
            const parsed = JSON.parse(data);
            availabilityData = Array.isArray(parsed) ? parsed : [];
          } catch {
            availabilityData = [];
          }
        } else if (Array.isArray(data)) {
          availabilityData = data;
        }
        
        setAvailability(availabilityData);
      } catch (err) {
        setAvailability([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailability();
  }, []);

  const addSlot = () => {
    if (!newSlot.time.trim()) {
      showToast("Please enter a time slot", "error");
      return;
    }
    setAvailability((prev) => {
      const copy = [...prev];
      const idx = copy.findIndex((d) => d.day === newSlot.day);
      if (idx >= 0) {
        copy[idx] = {
          ...copy[idx],
          slots: Array.from(new Set([...copy[idx].slots, newSlot.time.trim()])),
        };
      } else {
        copy.push({ day: newSlot.day, slots: [newSlot.time.trim()] });
      }
      return copy;
    });
    setNewSlot({ ...newSlot, time: "" });
  };

  const removeSlot = (day: string, slot: string) => {
    setAvailability((prev) => {
      const copy = [...prev];
      const idx = copy.findIndex((d) => d.day === day);
      if (idx >= 0) {
        copy[idx] = {
          ...copy[idx],
          slots: copy[idx].slots.filter((s) => s !== slot),
        };
        // Remove day if no slots left
        if (copy[idx].slots.length === 0) {
          copy.splice(idx, 1);
        }
      }
      return copy;
    });
  };

  const saveAvailability = async () => {
    setMessage(null);
    try {
      setSaving(true);
      // API expects availability as JSON string
      await put("/api/tutor/availability", JSON.stringify(availability));
      setMessage("Availability saved successfully.");
      showToast("Availability saved", "success");
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error || "Failed to save availability.";
      setMessage(errorMsg);
      showToast("Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-white glow-text">Availability</h1>
        <p className="text-sm text-white/70">Set your available time slots for tutoring sessions</p>
      </header>
      
      {loading ? (
        <div className="glass-card p-8 space-y-4 animate-pulse">
          <div className="h-12 bg-white/10 rounded" />
          <div className="h-12 bg-white/10 rounded" />
          <div className="h-24 bg-white/10 rounded" />
        </div>
      ) : (
        <div className="glass-card p-6 space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-white/90">Day</label>
              <select
                value={newSlot.day}
                onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })}
                className="glass-input w-full"
              >
                {days.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-white/90">Time Slot</label>
              <input
                value={newSlot.time}
                onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
                placeholder="e.g., 10:00 AM - 11:00 AM"
                className="glass-input w-full"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSlot();
                  }
                }}
              />
            </div>
            <button
              type="button"
              onClick={addSlot}
              className="glass-btn whitespace-nowrap"
            >
              Add slot
            </button>
          </div>

          <div className="space-y-3">
            {availability.length === 0 ? (
              <div className="glass-card px-6 py-8 text-center">
                <p className="text-sm text-white/60">No slots added yet. Add your first time slot above.</p>
              </div>
            ) : (
              availability.map((day) => (
                <div
                  key={day.day}
                  className="glass p-4 rounded-xl border border-white/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-white">{day.day}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {day.slots.map((slot) => (
                      <span
                        key={slot}
                        className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-white/80 bg-white/10 rounded-full border border-white/20"
                      >
                        {slot}
                        <button
                          type="button"
                          onClick={() => removeSlot(day.day, slot)}
                          className="text-white/60 hover:text-rose-300 transition-colors"
                          title="Remove slot"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {message && (
            <div className={`glass-card px-4 py-3 ${
              message.includes("successfully") 
                ? "border-emerald-500/30 bg-emerald-500/10" 
                : "border-rose-500/30 bg-rose-500/10"
            }`}>
              <p className={`text-sm ${
                message.includes("successfully") ? "text-emerald-300" : "text-rose-300"
              }`}>
                {message}
              </p>
            </div>
          )}
          <button
            type="button"
            disabled={saving || availability.length === 0}
            onClick={saveAvailability}
            className="glass-btn w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <span className="inline-flex items-center gap-2">
                <Spinner size={14} />
                Saving...
              </span>
            ) : (
              "Save availability"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
