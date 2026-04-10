import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { PageContainer } from "@/components/layout/PageContainer";

export function TutorOverview({ bio, teachingStyle, bestFor, expertise }: {
  bio?: string;
  teachingStyle?: string;
  bestFor?: string;
  expertise?: string[];
}) {
  return (
    <SectionWrapper padded={false}>
      <PageContainer>
        <SectionHeader title="Overview" description="What to expect when you learn with this tutor." />
        <div className="glass-card mt-4 space-y-4">
          {bio && <p className="text-sm text-white/80 leading-relaxed">{bio}</p>}
          {teachingStyle && (
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Teaching style</p>
              <p className="text-sm text-white/80 mt-1 leading-relaxed">{teachingStyle}</p>
            </div>
          )}
          {bestFor && (
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Best for</p>
              <p className="text-sm text-white/80 mt-1 leading-relaxed">{bestFor}</p>
            </div>
          )}
          {expertise && expertise.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Expertise</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {expertise.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/80 bg-white/5">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </PageContainer>
    </SectionWrapper>
  );
}
