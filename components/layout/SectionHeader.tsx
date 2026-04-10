import { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  align?: "left" | "center";
}

export function SectionHeader({ eyebrow, title, description, actions, align = "left" }: SectionHeaderProps) {
  const alignment = align === "center" ? "items-center text-center" : "items-start text-left";
  const wrapper = align === "center"
    ? "flex flex-col gap-2 sm:flex-col sm:items-center sm:justify-center"
    : "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between";

  return (
    <div className={wrapper}>
      <div className={`space-y-2 ${alignment}`}>
        {eyebrow && <p className="text-xs uppercase tracking-[0.3em] text-white/60">{eyebrow}</p>}
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        {description && <p className="text-sm text-white/70 max-w-3xl">{description}</p>}
      </div>
      {actions && <div className="mt-2 sm:mt-0 flex items-center gap-3">{actions}</div>}
    </div>
  );
}
