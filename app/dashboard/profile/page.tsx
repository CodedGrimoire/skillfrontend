"use client";

import { useAuth } from "@/src/context/AuthContext";
import { EmptyState } from "@/components/layout/EmptyState";

export default function StudentProfilePage() {
  const { user } = useAuth();
  const profile = {
    name: user?.name,
    email: user?.email,
    role: user?.role,
    timezone: "Set your timezone",
    learningGoals: "Describe your goals",
  };

  return (
    <div className="space-y-4">
      <div className="glass-card p-5 space-y-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">Personal info</p>
          <h2 className="text-lg font-semibold text-white">{profile.name || "Your name"}</h2>
          <p className="text-sm text-white/70">{profile.email || "you@example.com"}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-xs text-white/60">Role</p>
            <p className="text-sm text-white">{profile.role || "STUDENT"}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-xs text-white/60">Timezone</p>
            <p className="text-sm text-white/80">{profile.timezone}</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-5 space-y-3">
        <p className="text-xs uppercase tracking-[0.2em] text-white/60">Learning preferences</p>
        <p className="text-sm text-white/80">{profile.learningGoals}</p>
        <EmptyState
          title="Editing coming soon"
          description="Profile editing will be enabled once backend support is added."
          actionLabel="Browse tutors"
          actionHref="/tutors"
        />
      </div>
    </div>
  );
}
