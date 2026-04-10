interface SkeletonCardProps {
  lines?: number;
}

export function SkeletonCard({ lines = 3 }: SkeletonCardProps) {
  return (
    <div className="glass-card animate-pulse">
      <div className="h-10 w-10 rounded-full bg-white/10 mb-4" />
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, idx) => {
          const width = idx === 0 ? "w-2/3" : idx === lines - 1 ? "w-1/2" : "w-full";
          return <div key={idx} className={`h-3 rounded bg-white/10 ${width}`} />;
        })}
      </div>
    </div>
  );
}
