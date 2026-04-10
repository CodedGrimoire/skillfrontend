"use client";

import { useEffect, useMemo, useState } from "react";
import { get } from "@/src/lib/api";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { LoadingGrid } from "@/components/layout/LoadingGrid";
import { EmptyState } from "@/components/layout/EmptyState";

type User = {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
};

const roles = ["ALL", "STUDENT", "TUTOR", "ADMIN"];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await get<User[] | { users?: User[] }>("/api/admin/users");
        const data = Array.isArray(res.data) ? res.data : (res.data as any)?.users || [];
        setUsers(data);
      } catch (err) {
        setError("Unable to load users right now.");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    if (roleFilter === "ALL") return users;
    return users.filter((u) => (u.role || "").toUpperCase() === roleFilter);
  }, [users, roleFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-sm text-white/70">Moderate accounts and roles.</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-white/60">Role</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="glass-input text-sm"
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r === "ALL" ? "All roles" : r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingGrid items={6} columns={3} />
      ) : error ? (
        <div className="glass-card px-4 py-3 text-sm text-rose-300 border-rose-500/30 bg-rose-500/10">{error}</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No users"
          description="No users found for this filter."
          actionLabel="Reset filters"
          actionHref="#"
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c1027]">
          <div className="grid grid-cols-5 gap-3 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/60">
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          <div className="divide-y divide-white/5">
            {filtered.map((u) => (
              <div key={u.id} className="grid grid-cols-5 gap-3 px-4 py-3 text-sm text-white/80">
                <div className="font-semibold text-white truncate">{u.name || "User"}</div>
                <div className="truncate text-white/70">{u.email || "—"}</div>
                <div className="text-white/80">{(u.role || "UNKNOWN").toUpperCase()}</div>
                <div>
                  <StatusBadge status={u.status || "ACTIVE"} />
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <button
                    className="rounded-full bg-white/10 px-3 py-1 text-white/80 border border-white/15 cursor-not-allowed"
                    title="Backend action required"
                    disabled
                  >
                    Ban/Unban
                  </button>
                  <a href="/admin" className="text-purple-300 hover:text-purple-200">View</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
