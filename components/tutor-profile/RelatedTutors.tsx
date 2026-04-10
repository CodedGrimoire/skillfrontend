import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { TutorCard, TutorCardData } from "@/components/tutors/TutorCard";
import { LoadingGrid } from "@/components/layout/LoadingGrid";
import { EmptyState } from "@/components/layout/EmptyState";

export function RelatedTutors({ tutors, loading }: { tutors: TutorCardData[]; loading: boolean }) {
  return (
    <SectionWrapper padded={false}>
      <PageContainer>
        <SectionHeader title="Similar tutors" description="Explore other experts in this area." />
        {loading ? (
          <div className="mt-4">
            <LoadingGrid items={4} columns={4} />
          </div>
        ) : tutors.length === 0 ? (
          <div className="mt-4">
            <EmptyState title="No similar tutors yet" description="Browse all tutors to discover more options." actionLabel="Browse tutors" actionHref="/tutors" />
          </div>
        ) : (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {tutors.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        )}
      </PageContainer>
    </SectionWrapper>
  );
}
