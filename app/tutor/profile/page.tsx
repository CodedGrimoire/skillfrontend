"use client";

import { useEffect, useState } from "react";
import { get, put } from "@/src/lib/api";

type TutorProfile = {
  name: string;
  bio?: string;
  pricePerHour?: number;
  skills?: string;
};

export default function TutorProfilePage() {
  const [profile, setProfile] = useState<TutorProfile>({
    name: "",
    bio: "",
    pricePerHour: undefined,
    skills: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await get<TutorProfile>("/api/tutor/profile");
        const data = res.data;
        setProfile({
          ...data,
          skills: Array.isArray((data as any).skills)
            ? (data as any).skills.join(", ")
            : data.skills ?? "",
        });
      } catch (err) {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      setSaving(true);
      await put("/api/tutor/profile", {
        ...profile,
        skills: profile.skills
          ? profile.skills.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      });
      setMessage("Profile updated.");
    } catch (err) {
      setMessage("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">Tutor Profile</h1>
      {loading ? (
        <div className="h-44 rounded-xl bg-slate-200 animate-pulse" />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-800">Name</label>
            <input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-inner outline-none transition focus:border-slate-400 focus:bg-slate-50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-800">Bio</label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-inner outline-none transition focus:border-slate-400 focus:bg-slate-50"
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-800">Hourly Rate ($)</label>
            <input
              type="number"
              min={0}
              value={profile.pricePerHour ?? ""}
              onChange={(e) =>
                setProfile({ ...profile, pricePerHour: Number(e.target.value) })
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-inner outline-none transition focus:border-slate-400 focus:bg-slate-50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-800">
              Skills (comma separated)
            </label>
            <input
              value={profile.skills}
              onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-inner outline-none transition focus:border-slate-400 focus:bg-slate-50"
              placeholder="React, TypeScript, Node.js"
            />
          </div>
          {message && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              {message}
            </div>
          )}
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      )}
    </div>
  );
}
