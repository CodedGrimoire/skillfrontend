import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { PageContainer } from "@/components/layout/PageContainer";

const formats = [
  {
    title: "Interview prep sprints",
    detail: "Mock interviews with targeted drills, feedback, and next-step practice sets.",
  },
  {
    title: "Project co-building",
    detail: "Pair with a tutor to plan, build, and ship a real project or portfolio piece.",
  },
  {
    title: "Career navigation",
    detail: "Role-play negotiations, roadmap to senior/staff, and craft growth plans.",
  },
  {
    title: "Skill deep dives",
    detail: "Short, intensive blocks on a specific tool or topic—SQL, Figma, cloud, you name it.",
  },
];

export function FormatsSection() {
  return (
    <SectionWrapper>
      <PageContainer>
        <SectionHeader
          eyebrow="Popular formats"
          title="Choose the way you want to learn"
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {formats.map((f) => (
            <div key={f.title} className="glass-card h-full">
              <h3 className="text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">{f.detail}</p>
            </div>
          ))}
        </div>
      </PageContainer>
    </SectionWrapper>
  );
}
