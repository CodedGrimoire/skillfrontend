import Link from "next/link";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { PageContainer } from "@/components/layout/PageContainer";

export function DualCTASection() {
  return (
    <SectionWrapper>
      <PageContainer>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="glass-card border border-white/10 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-6 flex flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">For students</p>
            <h3 className="text-xl font-semibold text-white">Match with a tutor this week</h3>
            <p className="text-sm text-white/75">Share your goal, get tailored matches, and book your first session in minutes.</p>
            <div className="flex flex-wrap gap-2 text-xs text-white/70">
              <span className="rounded-full border border-white/15 px-3 py-1">Interview prep</span>
              <span className="rounded-full border border-white/15 px-3 py-1">Portfolio projects</span>
              <span className="rounded-full border border-white/15 px-3 py-1">Skill gaps</span>
            </div>
            <Link href="/tutors" className="glass-btn w-full sm:w-auto text-center mt-2">Find my tutor</Link>
          </div>

          <div className="glass-card border border-white/10 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-6 flex flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">For tutors</p>
            <h3 className="text-xl font-semibold text-white">Share your expertise</h3>
            <p className="text-sm text-white/75">Join a curated network, set your availability, and get matched with motivated learners.</p>
            <div className="flex flex-wrap gap-2 text-xs text-white/70">
              <span className="rounded-full border border-white/15 px-3 py-1">Flexible schedule</span>
              <span className="rounded-full border border-white/15 px-3 py-1">Fair payouts</span>
              <span className="rounded-full border border-white/15 px-3 py-1">Global learners</span>
            </div>
            <Link href="/register" className="glass-btn-secondary w-full sm:w-auto text-center mt-2">Apply as tutor</Link>
          </div>
        </div>
      </PageContainer>
    </SectionWrapper>
  );
}
