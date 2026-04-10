import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { CalendarIcon, GraduationCapIcon, SearchIcon, UserIcon } from "@/components/ui/Icons";

const steps = [
  {
    title: "Find your expert",
    description: "Search by skill, tool, or goal. Filters make it easy to see price, timezone, and modality.",
    Icon: SearchIcon,
  },
  {
    title: "Book in minutes",
    description: "Pick a slot that fits. Instant confirmation plus reminders before every session.",
    Icon: CalendarIcon,
  },
  {
    title: "Learn 1:1",
    description: "Live sessions with shared docs, code, and examples tailored to your projects.",
    Icon: GraduationCapIcon,
  },
  {
    title: "Track progress",
    description: "Recaps, next steps, and accountability built in so you keep momentum.",
    Icon: UserIcon,
  },
];

export function HowItWorksSection() {
  return (
    <SectionWrapper id="how-it-works">
      <PageContainer>
        <SectionHeader
          eyebrow="How SkillBridge works"
          title="A clear path from search to results"
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => (
            <div key={step.title} className="glass-card h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-full bg-white/10 p-2 border border-white/15">
                  <step.Icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-semibold text-white/60">Step {idx + 1}</span>
              </div>
              <h3 className="text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </PageContainer>
    </SectionWrapper>
  );
}
