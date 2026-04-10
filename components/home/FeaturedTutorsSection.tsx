import Link from "next/link";
import Image from "next/image";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { LoadingGrid } from "@/components/layout/LoadingGrid";
import { EmptyState } from "@/components/layout/EmptyState";
import { StarIcon } from "@/components/ui/Icons";

type Tutor = {
  id: string;
  name: string;
  subject?: string;
  category?: string;
  pricePerHour?: number;
  rating?: number;
  bio?: string;
  avatarUrl?: string;
  location?: string;
};

interface Props {
  tutors: Tutor[];
  loading: boolean;
}

const fallbackTutors: Tutor[] = [
  {
    id: "sample-1",
    name: "Aisha Rahman",
    subject: "Front-end Engineering",
    category: "Web Development",
    pricePerHour: 65,
    rating: 4.9,
    bio: "Senior engineer mentoring React, TypeScript, and system design interviews.",
    location: "Remote • UTC+1",
  },
  {
    id: "sample-2",
    name: "Carlos Mendes",
    subject: "Data & Analytics",
    category: "Data Science",
    pricePerHour: 70,
    rating: 4.8,
    bio: "Helps analysts transition into analytics engineering with SQL + dbt projects.",
    location: "Remote • UTC-3",
  },
  {
    id: "sample-3",
    name: "Priya Patel",
    subject: "Product Design",
    category: "Design",
    pricePerHour: 80,
    rating: 4.9,
    bio: "Portfolio storytelling, design critiques, and whiteboard challenges.",
    location: "Hybrid • NYC",
  },
  {
    id: "sample-4",
    name: "James Lee",
    subject: "Career & Leadership",
    category: "Career Coaching",
    pricePerHour: 90,
    rating: 4.7,
    bio: "Guides senior ICs to staff+ levels with roadmap planning and negotiation prep.",
    location: "Remote • UTC+8",
  },
];

export function FeaturedTutorsSection({ tutors, loading }: Props) {
  const list = tutors.length > 0 ? tutors : fallbackTutors;

  return (
    <SectionWrapper id="featured-tutors">
      <PageContainer>
        <SectionHeader
          eyebrow="Featured tutors"
          title="Handpicked experts for fast progress"
          description="Book 1:1 time with specialists who have shipped real products and mentored hundreds of learners."
          actions={<Link href="/tutors" className="glass-btn-secondary text-sm">View all tutors</Link>}
        />

        {loading && tutors.length === 0 ? (
          <div className="mt-8">
            <LoadingGrid items={4} />
          </div>
        ) : list.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="No tutors yet"
              description="Check back soon as we add more experts."
              actionLabel="Browse tutors"
              actionHref="/tutors"
            />
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((tutor) => (
              <div key={tutor.id} className="glass-card h-full flex flex-col">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-white/20 overflow-hidden flex items-center justify-center text-white font-semibold">
                    {tutor.avatarUrl ? (
                      <Image src={tutor.avatarUrl} alt={tutor.name} width={48} height={48} className="h-12 w-12 object-cover" />
                    ) : (
                      (tutor.name?.[0] || "T").toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-white truncate">{tutor.name}</h3>
                    <p className="text-xs text-white/60 truncate">{tutor.location || "Remote"}</p>
                  </div>
                  {tutor.rating && (
                    <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200 border border-emerald-500/30">
                      {tutor.rating.toFixed(1)} <StarIcon className="h-3 w-3 fill-emerald-200" />
                    </span>
                  )}
                </div>

                <div className="mt-3 space-y-2 text-sm text-white/80">
                  <p className="font-semibold text-white">{tutor.subject || tutor.category || "Tutoring"}</p>
                  <p className="line-clamp-3 text-white/70">{tutor.bio || "Personalized sessions tailored to your goals."}</p>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-white/70">
                  <span>{tutor.category || "General"}</span>
                  <span>{tutor.pricePerHour ? `$${tutor.pricePerHour}/hr` : "Custom"}</span>
                </div>

                <Link
                  href={`/tutors/${tutor.id}`}
                  className="mt-4 inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:border-white/30 hover:text-white"
                >
                  View profile
                </Link>
              </div>
            ))}
          </div>
        )}
      </PageContainer>
    </SectionWrapper>
  );
}
