const colorMap: Record<string, string> = {
  CONFIRMED: "bg-emerald-500/20 text-emerald-200 border-emerald-500/30",
  UPCOMING: "bg-blue-500/20 text-blue-200 border-blue-500/30",
  COMPLETED: "bg-emerald-500/20 text-emerald-200 border-emerald-500/30",
  CANCELLED: "bg-rose-500/20 text-rose-200 border-rose-500/30",
  PENDING: "bg-amber-500/20 text-amber-200 border-amber-500/30",
  DRAFT: "bg-white/10 text-white/70 border-white/20",
};

export function StatusBadge({ status }: { status: string }) {
  const cls = colorMap[status] || "bg-white/10 text-white/80 border-white/20";
  return <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${cls}`}>{status}</span>;
}
