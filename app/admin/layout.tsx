"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthGate } from "@/src/components/AuthGate";

const navItems = [
  { label: "Overview", href: "/admin" },
  { label: "Users", href: "/admin/users" },
  { label: "Bookings", href: "/admin/bookings" },
  { label: "Categories", href: "/admin/categories" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AuthGate mode="protected" allowedRoles={["ADMIN"]}>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 min-h-screen">
        {/* Sidebar */}
        <aside className="glass-card w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-6 h-fit">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-2 glow-text">Admin Console</h2>
            <div className="h-0.5 w-16 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 rounded-full" />
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center rounded-xl px-4 py-3 transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30 text-white font-semibold border border-white/20 shadow-lg shadow-blue-500/20"
                      : "text-white/70 hover:text-white hover:bg-white/10 border border-transparent"
                  }`}
                >
                  <span className="text-sm">{item.label}</span>
                  {active && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>
        
        {/* Main Content Area */}
        <section className="flex-1 min-w-0 w-full">
          {children}
        </section>
      </div>
    </AuthGate>
  );
}
