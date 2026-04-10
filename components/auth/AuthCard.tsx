import { ReactNode } from "react";

export function AuthCard({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="glass-card max-w-xl w-full mx-auto space-y-4">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        {subtitle && <p className="text-sm text-white/70">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
