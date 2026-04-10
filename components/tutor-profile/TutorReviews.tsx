import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { StarIcon } from "@/components/ui/Icons";
import { EmptyState } from "@/components/layout/EmptyState";

export type Review = {
  id: string;
  reviewer: string;
  rating: number;
  comment?: string;
  date?: string;
};

export function TutorReviews({ reviews }: { reviews: Review[] }) {
  return (
    <SectionWrapper padded={false}>
      <PageContainer>
        <SectionHeader
          title="Reviews"
          description="What learners say about sessions with this tutor."
          align="left"
        />
        {(!reviews || reviews.length === 0) ? (
          <div className="mt-4">
            <EmptyState
              title="No reviews yet"
              description="Be the first to book and leave feedback."
              actionLabel="Browse tutors"
              actionHref="/tutors"
            />
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {reviews.map((review) => (
              <div key={review.id} className="glass-card p-4 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 text-sm">
                  {Array.from({ length: Math.round(review.rating) }).map((_, idx) => (
                    <StarIcon key={idx} className="h-4 w-4 fill-amber-300" />
                  ))}
                  <span className="text-white/70 text-xs">{review.date || "Recent"}</span>
                </div>
                <p className="text-sm text-white font-semibold">{review.reviewer}</p>
                {review.comment && <p className="text-sm text-white/80 leading-relaxed">“{review.comment}”</p>}
              </div>
            ))}
          </div>
        )}
      </PageContainer>
    </SectionWrapper>
  );
}
