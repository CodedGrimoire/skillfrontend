"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";



import { useAuth } from "@/src/context/AuthContext";



import { redirectForRole } from "@/src/lib/auth";

export function NavLinks() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading, token, authLoading } = useAuth();




  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Debug: Log auth state changes
  useEffect(() => {
    console.log("🔍 [NavLinks] Auth state:", {
      user: user ? { id: user.id, name: user.name, email: user.email, role: user.role } : null,
      token: token ? `${token.substring(0, 20)}...` : null,
      loading,
      authLoading,
      hasTokenInStorage: typeof window !== "undefined" ? !!localStorage.getItem("token") : false,
    });
  }, [user, token, loading, authLoading]);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
    setShowProfileMenu(false);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "TUTOR":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "STUDENT":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      default:
        return "bg-white/10 text-white/80 border-white/20";
    }
  };

  // Debug: Print role when dropdown opens
  useEffect(() => {
    if (showProfileMenu && user) {
      console.log("User Role:", user.role);
     
    }
  }, [showProfileMenu, user]);

  // Show loading state or nothing while checking auth
  if (loading) {
    return (
      <>
        <Link
          href="/"
          className={`relative transition-all ${
            isActive("/")
              ? "text-white font-semibold"
              : "text-white/80 hover:text-white"
          }`}
        >
          Home
          {isActive("/") && (
            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
          )}
        </Link>
        <Link
          href="/tutors"
          className={`relative transition-all ${
            isActive("/tutors")
              ? "text-white font-semibold"
              : "text-white/80 hover:text-white"
          }`}
        >
          Tutors
          {isActive("/tutors") && (
            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
          )}
        </Link>
      </>
    );
  }

  // Not logged in - show public links
  if (!user) {
    return (
      <>
        <Link
          href="/"
          className={`relative transition-all ${
            isActive("/")
              ? "text-white font-semibold"
              : "text-white/80 hover:text-white"
          }`}
        >
          Home
          {isActive("/") && (
            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
          )}
        </Link>
        <Link
          href="/tutors"
          className={`relative transition-all ${
            isActive("/tutors")
              ? "text-white font-semibold"
              : "text-white/80 hover:text-white"
          }`}
        >
          Tutors
          {isActive("/tutors") && (
            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
          )}
        </Link>
        <Link
          href="/login"
          className={`relative transition-all ${
            isActive("/login")
              ? "text-white font-semibold"
              : "text-white/80 hover:text-white"
          }`}
        >
          Login
          {isActive("/login") && (
            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
          )}
        </Link>
        <Link
          href="/register"
          className="glass-btn px-4 py-2"
        >
          Register
        </Link>
      </>
    );
  }

  // Logged in - show profile section
  return (
    <>
      <Link
        href="/"
        className={`relative transition-all ${
          isActive("/")
            ? "text-white font-semibold"
            : "text-white/80 hover:text-white"
        }`}
      >
        Home
        {isActive("/") && (
          <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
        )}
      </Link>
      <Link
        href="/tutors"
        className={`relative transition-all ${
          isActive("/tutors")
            ? "text-white font-semibold"
            : "text-white/80 hover:text-white"
        }`}
      >
        Tutors
        {isActive("/tutors") && (
          <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
        )}
      </Link>

      {/* Profile Section */}
      <div className="relative">
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="flex items-center gap-2 px-3 py-2 rounded-full border border-white/15 bg-[#0c1027] hover:bg-[#141a3a] transition-colors"
        >
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-white/20 flex items-center justify-center text-white font-semibold text-sm">
            {((user.name || user.email || "U")[0] || "U").toUpperCase()}
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-sm font-semibold text-white">
              {user.name || (user.email ? user.email.split("@")[0] : "User")}
            </div>
            <div className={`text-xs px-2 py-0.5 rounded-full border ${getRoleBadgeColor(user.role)}`}>
              {user.role}
            </div>
          </div>
        </button>

        {showProfileMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowProfileMenu(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-white/12 bg-[#0c1027] shadow-xl z-50">
              <div className="p-4 border-b border-white/10">
                <div className="text-sm font-semibold text-white">
                  {user.name || user.email || "User"}
                </div>
                {user.email && (
                  <div className="text-xs text-white/70 mt-1">{user.email}</div>
                )}
                <div className="mt-3 space-y-2">
                  <div className="text-xs text-white/50 uppercase tracking-wide">Role</div>
                  <div className={`text-sm px-3 py-1.5 rounded-full border font-semibold inline-block ${getRoleBadgeColor(user.role)}`}>
                    {user.role || "N/A"}
                  </div>
                </div>
              </div>
              <div className="p-2 space-y-1">
                <Link
                  href={redirectForRole(user.role)}
                  onClick={() => setShowProfileMenu(false)}
                  className="block w-full text-left px-4 py-2 text-sm rounded-lg bg-white/5 hover:bg-white/10 text-white transition"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm rounded-lg bg-white/5 hover:bg-rose-500/15 text-rose-200 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
