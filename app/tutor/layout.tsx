import { ReactNode } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const navItems = [
  { label: "Dashboard", href: "/tutor/dashboard" },
  { label: "Availability", href: "/tutor/availability" },
  { label: "Sessions", href: "/tutor/sessions" },
  { label: "Profile", href: "/tutor/profile" },
];

export default function TutorLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayout
      title="Tutor"
      subtitle="Track your sessions, availability, and profile."
      navItems={navItems}
      allowedRoles={["TUTOR"]}
    >
      {children}
    </DashboardLayout>
  );
}
