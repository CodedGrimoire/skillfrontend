"use client";

import { useEffect, useState } from "react";
import { get, put } from "@/src/lib/api";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/src/context/ToastContext";

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
  const { showToast } = useToast();

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
    
    // Validation
    if (!profile.name.trim()) {
      setMessage("Name is required.");
      showToast("Name is required", "error");
      return;
    }
    if (profile.pricePerHour !== undefined && profile.pricePerHour < 0) {
      setMessage("Hourly rate must be a positive number.");
      showToast("Invalid hourly rate", "error");
      return;
    }
    
    try {
      setSaving(true);
      await put("/api/tutor/profile", {
        ...profile,
        skills: profile.skills
          ? profile.skills.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      });
      setMessage("Profile updated successfully.");
      showToast("Profile updated", "success");
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error || "Failed to update profile.";
      setMessage(errorMsg);
      showToast("Profile update failed", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-white glow-text">Tutor Profile</h1>
        <p className="text-sm text-white/70">Manage your tutor profile information</p>
      </header>
      
      {loading ? (
        <div className="glass-card p-8 space-y-4 animate-pulse">
          <div className="h-4 w-32 bg-white/10 rounded" />
          <div className="h-12 bg-white/10 rounded" />
          <div className="h-4 w-32 bg-white/10 rounded" />
          <div className="h-24 bg-white/10 rounded" />
          <div className="h-4 w-32 bg-white/10 rounded" />
          <div className="h-12 bg-white/10 rounded" />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="glass-card p-6 space-y-6"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Name</label>
            <input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="glass-input w-full"
              required
              minLength={2}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Bio</label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="glass-input w-full"
              rows={4}
              placeholder="Tell students about your teaching experience and expertise..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Hourly Rate ($)</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={profile.pricePerHour ?? ""}
              onChange={(e) =>
                setProfile({ ...profile, pricePerHour: e.target.value ? Number(e.target.value) : undefined })
              }
              className="glass-input w-full"
              placeholder="e.g., 45.00"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">
              Skills (comma separated)
            </label>
            <input
              value={profile.skills}
              onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
              className="glass-input w-full"
              placeholder="React, TypeScript, Node.js"
            />
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
            type="submit"
            disabled={saving}
            className="glass-btn w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <span className="inline-flex items-center gap-2">
                <Spinner size={14} />
                Saving...
              </span>
            ) : (
              "Save changes"
            )}
          </button>
        </form>
      )}
    </div>
  );
}
