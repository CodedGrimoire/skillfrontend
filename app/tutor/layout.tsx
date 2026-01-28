"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthGate } from "@/src/components/AuthGate";

const navItems = [
  { label: "Overview", href: "/tutor/dashboard" },
  { label: "Sessions", href: "/tutor/dashboard" }, // same overview includes sessions list
  { label: "Profile", href: "/tutor/profile" },
  { label: "Availability", href: "/tutor/availability" },
];

export default function TutorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AuthGate mode="protected" allowedRoles={["TUTOR"]}>
      <div className="grid gap-6 md:grid-cols-[220px,1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 text-sm font-semibold text-slate-700">
            Tutor Dashboard
          </div>
          <nav className="space-y-1 text-sm">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 transition ${
                    active
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <section>{children}</section>
      </div>
    </AuthGate>
  );
}
