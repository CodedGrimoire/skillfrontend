import Link from "next/link";
import { useState } from "react";

type NavItem = { label: string; href: string };

export function DashboardSidebar({ items, title }: { items: NavItem[]; title: string }) {
  const [open, setOpen] = useState(false);

  const Nav = () => (
    <nav className="space-y-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="block rounded-lg px-3 py-2 text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10"
          onClick={() => setOpen(false)}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <aside className="lg:w-64 w-full">
      <div className="flex items-center justify-between lg:hidden mb-3">
        <p className="text-sm font-semibold text-white">{title}</p>
        <button
          className="glass-btn-secondary text-xs"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Hide menu" : "Menu"}
        </button>
      </div>
      <div className="hidden lg:block glass-card p-4 space-y-3 sticky top-6">
        <p className="text-xs uppercase tracking-[0.2em] text-white/60">{title}</p>
        <Nav />
      </div>
      {open && (
        <div className="lg:hidden glass-card p-4 space-y-3 mb-4">
          <Nav />
        </div>
      )}
    </aside>
  );
}
