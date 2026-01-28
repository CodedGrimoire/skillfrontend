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
    try {
      setSaving(true);
      await put("/api/students/profile", profile);
      setMessage("Profile updated.");
      showToast("Profile updated", "success");
      refresh();
    } catch (err) {
      setMessage("Failed to update profile.");
      showToast("Profile update failed", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">Profile</h1>
      {loading ? (
        <div className="h-40 rounded-xl bg-slate-200 animate-pulse" />
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
            <label className="text-sm font-medium text-slate-800">Email</label>
            <input
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-inner outline-none transition focus:border-slate-400 focus:bg-slate-50"
              type="email"
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
