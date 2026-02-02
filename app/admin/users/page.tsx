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
    }
    
    
    catch (err) 
    
    
    {
      setError("Unable to load users.");
      setUsers([]);
    } 
    
    finally
    
    
    {
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
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-white glow-text">
          
          Users
          
          
          </h1>
        <p className="text-sm text-white/70">
        
        
        Manage all platform users
        
        
        </p>
      </header>
      
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-16 glass rounded-xl animate-pulse border border-white/10" />
          ))}
        </div>
      ) : error ? (
        <div className="glass-card px-6 py-4 border-rose-500/30 bg-rose-500/10">
          <p className="text-sm text-rose-300">{error}</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div 
            className="grid px-6 py-4 text-xs font-semibold uppercase tracking-wide text-white/70 border-b border-white/10"
            style={{ gridTemplateColumns: '1fr 2fr 1fr 1.5fr' }}
          >
            <span>
              
              Name</span>



            <span>Email</span>
            <span>Role</span>
            <span>Status</span>
          </div>
          <div className="divide-y divide-white/10">
            {users.map((u) => (
              <div
                key={u.id}
                className="grid items-center px-6 py-4 text-sm hover:bg-white/5 transition-colors"
                style={{ gridTemplateColumns: '1fr 2fr 1fr 1.5fr' }}
              >
                <span className="font-medium text-white">{u.name}</span>



                <span className="text-white/70">{u.email}</span>
                <span className="text-white/80">{u.role}</span>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold border ${
                      u.status === "BANNED"
                        ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                        : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    }`}
                  >
                    {u.status ?? "ACTIVE"}
                  </span>
                  {u.role !== "ADMIN" && (
                    <button
                      onClick={() => toggleStatus(u.id, u.status)}
                      disabled={actionId === u.id}
                      className="text-xs font-semibold text-white/70 hover:text-white underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
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
