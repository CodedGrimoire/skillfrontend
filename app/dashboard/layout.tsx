import { ReactNode } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "My Bookings", href: "/dashboard/bookings" },
  { label: "Profile", href: "/dashboard/profile" },
];

export default function StudentDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayout
      title="Student"
      subtitle="Manage your sessions, bookings, and learning profile."
      navItems={navItems}
      allowedRoles={["STUDENT", "USER"]}
    >
      {children}
    </DashboardLayout>
  );
}
