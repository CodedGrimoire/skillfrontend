"use client";

import { useEffect, useState } from "react";
import { get, patch } from "@/src/lib/api";
import { useToast } from "@/src/context/ToastContext";
import { Spinner } from "@/components/ui/Spinner";

type User = {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "TUTOR" | "ADMIN";
  status?: "ACTIVE" | "BANNED";
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchUsers = async () => {
    setError(null);
    try {
      const res = await get<{ success: boolean; users: User[] }>("/api/admin/users");
      // Extract users array from response: { success: true, users: [...] }
      const usersArray = res.data.users || res.data || [];
      setUsers(Array.isArray(usersArray) ? usersArray : []);
    } catch (err) {
      setError("Unable to load users.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (userId: string, current: User["status"]) => {
    setActionId(userId);
    try {
      await patch(`/api/admin/users/${userId}`, {
        status: current === "BANNED" ? "ACTIVE" : "BANNED",
      });
      await fetchUsers();
      showToast("Status updated", "success");
    } catch (err) {
      setError("Action failed. Please try again.");
      showToast("Action failed", "error");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">Users</h1>
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-12 rounded-xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-4 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span>Status</span>
          </div>
          <div className="divide-y divide-slate-100">
            {users.map((u) => (
              <div
                key={u.id}
                className="grid grid-cols-4 items-center px-4 py-3 text-sm text-slate-800"
              >
                <span className="font-medium text-slate-900">{u.name}</span>
                <span className="text-slate-600">{u.email}</span>
                <span className="text-slate-700">{u.role}</span>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      u.status === "BANNED"
                        ? "bg-rose-50 text-rose-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {u.status ?? "ACTIVE"}
                  </span>
                  {u.role !== "ADMIN" && (
                    <button
                      onClick={() => toggleStatus(u.id, u.status)}
                      disabled={actionId === u.id}
                      className="text-xs font-semibold text-slate-700 underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {actionId === u.id ? (
                        <span className="inline-flex items-center gap-2">
                          <Spinner size={12} />
                          Working...
                        </span>
                      ) : (
                        u.status === "BANNED" ? "Unban" : "Ban"
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
