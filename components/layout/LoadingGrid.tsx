import { SkeletonCard } from "./SkeletonCard";

interface LoadingGridProps {
  columns?: number;
  items?: number;
}

export function LoadingGrid({ columns = 3, items = 6 }: LoadingGridProps) {
  const gridCols =
    columns === 2
      ? "sm:grid-cols-2"
      : columns === 4
        ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <div className={`grid gap-6 ${gridCols}`}>
      {Array.from({ length: items }).map((_, idx) => (
        <SkeletonCard key={idx} />
      ))}
    </div>
  );
}
