"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthGate } from "@/src/components/AuthGate";

const navItems = [
  { id: "overview", label: "Overview", href: "/tutor/dashboard" },
  { id: "sessions", label: "Sessions", href: "/tutor/dashboard" }, // same overview includes sessions list
  { id: "profile", label: "Profile", href: "/tutor/profile" },
  { id: "availability", label: "Availability", href: "/tutor/availability" },
];

export default function TutorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AuthGate mode="protected" allowedRoles={["TUTOR"]}>
      <div className="flex gap-6 min-h-screen">
        <aside className="glass-card w-64 flex-shrink-0 sticky top-6 h-fit">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white mb-1">Tutor Dashboard</h2>
            <div className="h-0.5 w-12 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 rounded-full" />
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center rounded-xl px-4 py-3 transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-cyan-500/30 text-white font-semibold border border-white/20 shadow-lg shadow-purple-500/20"
                      : "text-white/70 hover:text-white hover:bg-white/10 border border-transparent"
                  }`}
                >
                  <span className="text-sm">{item.label}</span>
                  {active && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>
        <section className="flex-1 min-w-0">{children}</section>
      </div>
    </AuthGate>
  );
}
