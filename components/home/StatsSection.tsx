import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { PageContainer } from "@/components/layout/PageContainer";

const stats = [
  { label: "Tutors", value: "300+", detail: "Vetted experts across tech, design, and business" },
  { label: "Sessions completed", value: "12,000+", detail: "1:1 lessons, mock interviews, portfolio reviews" },
  { label: "Avg rating", value: "4.8/5", detail: "Consistent quality from verified reviews" },
  { label: "Time to match", value: "< 24h", detail: "Get paired with a tutor in under a day" },
];

export function StatsSection() {
  return (
    <SectionWrapper>
      <PageContainer>
        <SectionHeader
          eyebrow="Trusted outcomes"
          title="Built for learners who want real progress"
          description="We combine vetted experts, structured sessions, and accountability to keep you moving."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="glass-card border border-white/10 bg-white/5 p-5"
            >
              <p className="text-2xl font-semibold text-white">{item.value}</p>
              <p className="text-sm text-white/70 mt-1">{item.label}</p>
              <p className="text-xs text-white/60 mt-2 leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </PageContainer>
    </SectionWrapper>
  );
}
