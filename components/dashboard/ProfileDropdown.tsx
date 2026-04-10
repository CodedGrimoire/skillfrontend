"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";

export function ProfileDropdown() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const initial = (user?.name || user?.email || "U")[0]?.toUpperCase() ?? "U";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-full border border-white/15 bg-white/5 text-white text-sm"
      >
        <span className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-white/20 flex items-center justify-center text-sm font-semibold">
          {initial}
        </span>
        <span className="hidden sm:block text-left">
          <span className="block text-white text-sm font-semibold">{user?.name || "User"}</span>
          <span className="block text-xs text-white/60">{user?.email || ""}</span>
        </span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/12 bg-[#0c1027] shadow-xl z-50">
          <div className="p-4 border-b border-white/10 text-sm text-white/80">
            <div className="font-semibold text-white">{user?.name || "User"}</div>
            {user?.email && <div className="text-xs text-white/60 mt-1">{user.email}</div>}
            <div className="text-xs text-white/60 mt-2">Role: {user?.role || ""}</div>
          </div>
          <div className="p-2 space-y-1 text-sm">
            <Link href="/dashboard/profile" className="block w-full text-left px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white">
              Profile
            </Link>
            <button
              onClick={logout}
              className="block w-full text-left px-4 py-2 rounded-lg bg-white/5 hover:bg-rose-500/15 text-rose-200"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
