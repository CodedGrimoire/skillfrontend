import Link from "next/link";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { PageContainer } from "@/components/layout/PageContainer";

const resources = [
  {
    title: "Interview prep template: system design",
    href: "/blog",
    tag: "Template",
  },
  {
    title: "How to run a great tutor session as a learner",
    href: "/blog",
    tag: "Guide",
  },
  {
    title: "From bootcamp to first offer: a 90-day plan",
    href: "/blog",
    tag: "Playbook",
  },
];

export function ResourcesSection() {
  return (
    <SectionWrapper>
      <PageContainer>
        <SectionHeader
          eyebrow="Resources"
          title="Guides and templates from our community"
          actions={<Link href="/blog" className="glass-btn-secondary text-sm">View all resources</Link>}
        />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((item) => (
            <Link key={item.title} href={item.href} className="glass-card block hover:border-white/30">
              <span className="text-xs font-semibold text-white/60">{item.tag}</span>
              <p className="mt-2 text-sm text-white/80 font-semibold">{item.title}</p>
              <p className="mt-3 text-xs text-white/60">Read →</p>
            </Link>
          ))}
        </div>
      </PageContainer>
    </SectionWrapper>
  );
}
