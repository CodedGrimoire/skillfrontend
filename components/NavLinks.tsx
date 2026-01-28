"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLinks() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/tutors", label: "Tutors" },
    { href: "/login", label: "Login" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  return (
    <>
      {links.map((link) => {
        const active = isActive(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`relative transition-all ${
              active
                ? "text-white font-semibold"
                : "text-white/80 hover:text-white"
            }`}
          >
            {link.label}
            {active && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
            )}
          </Link>
        );
      })}
      <Link
        href="/register"
        className="glass-btn px-4 py-2"
      >
        Register
      </Link>
    </>
  );
}
