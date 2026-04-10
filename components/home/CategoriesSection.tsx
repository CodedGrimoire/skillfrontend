import Link from "next/link";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { LoadingGrid } from "@/components/layout/LoadingGrid";

const fallbackCategories = [
  "Web Development",
  "Data Science",
  "UI/UX Design",
  "Mobile Development",
  "Product Management",
  "Career Coaching",
  "Cloud & DevOps",
  "Machine Learning Ops",
  "Cybersecurity",
  "English for Tech",
];

interface Props {
  categories: { id: string; name: string }[];
  loading: boolean;
}

export function CategoriesSection({ categories, loading }: Props) {
  const list = categories.length > 0 ? categories.map((c) => c.name) : fallbackCategories;

  return (
    <SectionWrapper>
      <PageContainer>
        <SectionHeader
          eyebrow="Subjects"
          title="Explore by subject"
          description="Pick a category to see tutors who specialize in that area."
          actions={<Link href="/tutors" className="glass-btn-secondary text-sm">Browse all</Link>}
        />

        {loading && categories.length === 0 ? (
          <div className="mt-6">
            <LoadingGrid items={6} columns={3} />
          </div>
        ) : (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((name) => (
              <Link
                key={name}
                href={`/tutors?category=${encodeURIComponent(name)}`}
                className="glass-card px-5 py-4 text-sm font-semibold text-white hover:border-white/30 hover:text-white flex items-center justify-between"
              >
                <span>{name}</span>
                <span className="text-white/60 text-xs">View tutors →</span>
              </Link>
            ))}
          </div>
        )}
      </PageContainer>
    </SectionWrapper>
  );
}
