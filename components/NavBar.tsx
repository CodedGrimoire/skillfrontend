"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { NavLinks } from "./NavLinks";
import { PageContainer } from "./layout/PageContainer";
import { ChevronDownIcon, MenuIcon, XIcon } from "./ui/Icons";

const exploreItems = [
  { label: "Top Rated Tutors", href: "/tutors?sort=rating_desc" },
  { label: "Web & Software", href: "/tutors?category=Web%20Development" },
  { label: "Data & AI", href: "/tutors?category=Data%20Science" },
  { label: "Design & Product", href: "/tutors?category=Design" },
];

const primaryLinks = [
  { label: "About", href: "/about" },
  { label: "Resources", href: "/blog" },
  { label: "Help", href: "/help" },
  { label: "Contact", href: "/contact" },
];

export function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  const navLinks = (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
      <div className="relative">
        <button
          onClick={() => setExploreOpen((v) => !v)}
          className="inline-flex items-center gap-2 text-white/80 hover:text-white font-medium"
        >
          Explore <ChevronDownIcon className="h-4 w-4" />
        </button>
        {exploreOpen && (
          <div className="absolute left-0 mt-2 w-64 rounded-xl border border-white/10 bg-[#0c1027] shadow-xl z-50">
            <div className="p-3 space-y-1">
              {exploreItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
                  onClick={() => {
                    setExploreOpen(false);
                    setMenuOpen(false);
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      {primaryLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`text-sm font-medium transition-colors ${
            isActive(link.href) ? "text-white" : "text-white/80 hover:text-white"
          }`}
          onClick={() => setMenuOpen(false)}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-[#0c1027]/80 border-b border-white/10">
      <PageContainer className="flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <button
            className="sm:hidden text-white/80 hover:text-white"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
          <Link href="/" className="text-lg font-semibold tracking-tight text-white">
            SkillBridge
          </Link>
        </div>

        <div className="hidden sm:flex items-center gap-8">
          {navLinks}
          <div className="h-6 w-px bg-white/10" />
          <div className="flex items-center gap-4 text-sm font-medium">
            <NavLinks />
          </div>
        </div>

        <div className="sm:hidden">
          <div className="flex items-center gap-3 text-sm font-medium">
            <NavLinks />
          </div>
        </div>
      </PageContainer>

      {menuOpen && (
        <div className="sm:hidden border-t border-white/10 bg-[#0c1027]/95">
          <PageContainer className="py-4 space-y-4">
            {navLinks}
          </PageContainer>
        </div>
      )}
    </header>
  );
}
