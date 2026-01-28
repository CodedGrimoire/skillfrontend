"use client";

export function Spinner({ size = 16 }: { size?: number }) {
  const border = Math.max(2, Math.floor(size / 8));
  return (
    <span
      className="inline-block animate-spin rounded-full border-slate-300 border-t-slate-900"
      style={{ width: size, height: size, borderWidth: border }}
      aria-hidden
    />
  );
}
