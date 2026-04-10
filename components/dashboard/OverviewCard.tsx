interface OverviewCardProps {
  title: string;
  value: string;
  sublabel?: string;
  accent?: string;
}

export function OverviewCard({ title, value, sublabel, accent = "from-blue-500/20 to-purple-500/20" }: OverviewCardProps) {
  return (
    <div className="glass-card relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-60`} />
      <div className="relative z-10 space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-white/60">{title}</p>
        <p className="text-2xl font-semibold text-white">{value}</p>
        {sublabel && <p className="text-xs text-white/60">{sublabel}</p>}
      </div>
    </div>
  );
}
