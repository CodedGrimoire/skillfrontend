"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { PageContainer } from "@/components/layout/PageContainer";
import { ChevronDownIcon, SearchIcon } from "@/components/ui/Icons";

const highlights = [
  {
    title: "Ace your technical interviews",
    desc: "Mock interviews and drills with senior engineers from FAANG and top startups.",
    pill: "Tech interviews",
  },
  {
    title: "Portfolio-worthy design critiques",
    desc: "Weekly critique sessions with product designers to polish your case studies.",
    pill: "Design portfolio",
  },
  {
    title: "Data & AI study plans",
    desc: "Structured learning paths with projects, feedback, and accountability.",
    pill: "Data & AI",
  },
];

const quickLinks = [
  { label: "Web Dev", href: "/tutors?category=Web%20Development" },
  { label: "Data & AI", href: "/tutors?category=Data%20Science" },
  { label: "UI/UX", href: "/tutors?category=Design" },
  { label: "Career", href: "/tutors?category=Career%20Coaching" },
];

export function HeroSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % highlights.length);
    }, 5200);
    return () => clearInterval(id);
  }, []);

  const highlight = highlights[active];

  return (
    <SectionWrapper padded={false} className="pt-10">
      <PageContainer>
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0b122f] via-[#11183a] to-[#0f122c] px-6 py-10 sm:px-10 sm:py-14">
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute right-10 top-[-40px] h-64 w-64 rounded-full bg-blue-500/15 blur-3xl" />
            <div className="absolute left-[-40px] bottom-[-60px] h-72 w-72 rounded-full bg-purple-500/15 blur-3xl" />
          </div>

          <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                Live 1:1 tutoring • Accountability • Real projects
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                  {highlight.title}
                </h1>
                <p className="text-lg text-white/75 sm:text-xl max-w-2xl">
                  {highlight.desc}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/tutors" className="glass-btn w-full sm:w-auto text-center">
                  Find a tutor now
                </Link>
                <Link
                  href="/register"
                  className="glass-btn-secondary w-full sm:w-auto text-center"
                >
                  Become a tutor
                </Link>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 w-full sm:w-96">
                  <SearchIcon className="h-5 w-5 text-white/60" />
                  <input
                    className="bg-transparent flex-1 text-sm text-white/80 outline-none placeholder:text-white/50"
                    placeholder="Try “React for interviews” or “Advanced SQL”"
                  />
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-white/80">
                  {quickLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-full border border-white/15 bg-white/5 px-3 py-1 hover:border-white/30 hover:text-white"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white/80">Spotlight</span>
                  <div className="flex items-center gap-2 text-white/60 text-xs">
                    <span>{active + 1} / {highlights.length}</span>
                    <div className="flex gap-1">
                      {highlights.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActive(idx)}
                          className={`h-1.5 w-6 rounded-full transition-all ${idx === active ? "bg-white" : "bg-white/30"}`}
                          aria-label={`Go to slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-gradient-to-br from-blue-500/15 via-purple-500/15 to-cyan-500/10 p-5 text-white">
                  <p className="text-sm uppercase tracking-[0.25em] text-white/70">{highlight.pill}</p>
                  <p className="mt-3 text-lg font-semibold">{highlight.title}</p>
                  <p className="mt-2 text-sm text-white/80 leading-relaxed">{highlight.desc}</p>
                  <Link href="/tutors" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white">
                    Browse tutors <ChevronDownIcon className="h-4 w-4 rotate-[-90deg]" />
                  </Link>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center text-xs text-white/70">
                  <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-3">
                    <p className="text-lg font-bold text-white">4.8/5</p>
                    <p>Avg tutor rating</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-3">
                    <p className="text-lg font-bold text-white">12k</p>
                    <p>Sessions completed</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-3">
                    <p className="text-lg font-bold text-white">24h</p>
                    <p>Avg time to match</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center text-white/60 text-sm">
            Scroll to explore <ChevronDownIcon className="h-4 w-4" />
          </div>
        </div>
      </PageContainer>
    </SectionWrapper>
  );
}
