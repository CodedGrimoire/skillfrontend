import { ReactNode } from "react";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: ReactNode;
}

export function EmptyState({ title, description, actionLabel, actionHref, icon }: EmptyStateProps) {
  return (
    <div className="glass-card text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-white/70">
        {icon ?? <span className="text-lg">•</span>}
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {description && <p className="mt-2 text-sm text-white/70">{description}</p>}
      {actionHref && actionLabel && (
        <Link href={actionHref} className="mt-4 inline-flex items-center justify-center rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
