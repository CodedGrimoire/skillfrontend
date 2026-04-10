import { ReactNode } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Users", href: "/admin/users" },
  { label: "Bookings", href: "/admin/bookings" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Analytics", href: "/admin/analytics" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayout
      title="Admin"
      subtitle="Moderate the platform, users, and bookings."
      navItems={navItems}
      allowedRoles={["ADMIN"]}
    >
      {children}
    </DashboardLayout>
  );
}
