import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { SparklesIcon, TargetIcon, HandshakeIcon, RocketIcon } from "@/components/ui/Icons";

const benefits = [
  {
    title: "Vetted expertise",
    description: "Every tutor is screened for subject depth, teaching ability, and real-world experience.",
    Icon: TargetIcon,
  },
  {
    title: "Personalized plans",
    description: "We co-design learning paths with milestones, projects, and practice tailored to you.",
    Icon: SparklesIcon,
  },
  {
    title: "Accountability built-in",
    description: "Session recaps, next steps, and reminders keep you on track between meetings.",
    Icon: HandshakeIcon,
  },
  {
    title: "Practical outcomes",
    description: "Ship portfolio pieces, prep interviews, or unblock a work project—not just watch tutorials.",
    Icon: RocketIcon,
  },
];

export function BenefitsSection() {
  return (
    <SectionWrapper>
      <PageContainer>
        <SectionHeader
          eyebrow="Why SkillBridge"
          title="A tutoring platform built for doers"
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item) => (
            <div key={item.title} className="glass-card h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-lg bg-white/10 p-2 border border-white/15">
                  <item.Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </PageContainer>
    </SectionWrapper>
  );
}
