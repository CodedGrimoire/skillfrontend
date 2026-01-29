"use client";

import { useEffect, useState } from "react";
import { get, put } from "@/src/lib/api";
import { useAuth } from "@/src/context/AuthContext";
import { useToast } from "@/src/context/ToastContext";
import { Spinner } from "@/components/ui/Spinner";

type Profile = {
  name: string;
  email: string;
};

export default function StudentProfilePage() {
  const { user, refresh } = useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useState<Profile>({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await get<Profile>("/api/students/profile");
        setProfile(res.data);
      } catch (err) {
        if (user) {
          setProfile({ name: user.name, email: user.email });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    
    // Validation
    if (!profile.name.trim()) {
      setMessage("Name is required.");
      showToast("Name is required", "error");
      return;
    }
    if (!profile.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      setMessage("Please enter a valid email address.");
      showToast("Invalid email address", "error");
      return;
    }
    
    try {
      setSaving(true);
      await put("/api/students/profile", profile);
      setMessage("Profile updated successfully.");
      showToast("Profile updated", "success");
      refresh();
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
        <h1 className="text-3xl font-bold text-white glow-text">Profile</h1>
        <p className="text-sm text-white/70">Manage your account information</p>
      </header>
      
      {loading ? (
        <div className="glass-card p-8 space-y-4 animate-pulse">
          <div className="h-4 w-32 bg-white/10 rounded" />
          <div className="h-12 bg-white/10 rounded" />
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
            <label className="text-sm font-medium text-white/90">Email</label>
            <input
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="glass-input w-full"
              type="email"
              required
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
