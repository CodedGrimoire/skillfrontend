import Link from "next/link";

export function DashboardHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        <p className="text-sm text-white/70">Stay on top of your SkillBridge activity.</p>
      </div>
      {action}
    </div>
  );
}
