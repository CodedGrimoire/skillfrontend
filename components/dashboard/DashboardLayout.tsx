"use client";

import { ReactNode, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { AuthGate } from "@/src/components/AuthGate";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ProfileDropdown } from "@/components/dashboard/ProfileDropdown";

export type NavItem = { label: string; href: string };

type Role = "STUDENT" | "TUTOR" | "ADMIN";

interface Props {
  title: string;
  subtitle?: string;
  navItems: NavItem[];
  allowedRoles: Role[];
  children: ReactNode;
}

export function DashboardLayout({ title, subtitle, navItems, allowedRoles, children }: Props) {
  const pathname = usePathname();
  const { user } = useAuth();

  const activeTitle = useMemo(() => {
    const found = navItems.find((i) => pathname?.startsWith(i.href));
    return found?.label || title;
  }, [pathname, navItems, title]);

  return (
    <AuthGate mode="protected" allowedRoles={allowedRoles}>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-start justify-between gap-3 mb-6">
          <DashboardHeader title={activeTitle} action={<ProfileDropdown />} />
          {subtitle && <p className="text-xs text-white/60 max-w-sm leading-relaxed hidden sm:block">{subtitle}</p>}
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <DashboardSidebar items={navItems} title={title} />
          <main className="flex-1 min-w-0 space-y-6">{children}</main>
        </div>
      </div>
    </AuthGate>
  );
}
