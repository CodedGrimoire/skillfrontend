import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { PageContainer } from "@/components/layout/PageContainer";

export function NewsletterSection() {
  return (
    <SectionWrapper>
      <PageContainer>
        <div className="glass-card grid gap-4 lg:grid-cols-[2fr_1fr] items-center p-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Stay in the loop</p>
            <h3 className="text-xl font-semibold text-white">Get SkillBridge updates and learning playbooks</h3>
            <p className="text-sm text-white/70">Monthly digest of new tutors, upcoming workshops, and templates you can use.</p>
          </div>
          <form
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Subscribed! We'll send updates soon.");
            }}
          >
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="glass-input w-full"
            />
            <button type="submit" className="glass-btn w-full sm:w-auto">Subscribe</button>
          </form>
        </div>
      </PageContainer>
    </SectionWrapper>
  );
}
