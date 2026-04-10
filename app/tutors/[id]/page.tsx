"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { get } from "@/src/lib/api";
import { PageContainer } from "@/components/layout/PageContainer";
import { LoadingGrid } from "@/components/layout/LoadingGrid";
import { EmptyState } from "@/components/layout/EmptyState";
import { TutorProfileHeader, TutorProfile } from "@/components/tutor-profile/TutorProfileHeader";
import { TutorOverview } from "@/components/tutor-profile/TutorOverview";
import { TutorKeyInfo } from "@/components/tutor-profile/TutorKeyInfo";
import { TutorReviews, Review } from "@/components/tutor-profile/TutorReviews";
import { RelatedTutors } from "@/components/tutor-profile/RelatedTutors";
import { TutorCardData } from "@/components/tutors/TutorCard";

export default function TutorDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string | undefined);

  const [tutor, setTutor] = useState<TutorProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<TutorCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchTutor = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await get<any>(`/api/tutors/${id}`);
        const data: any = res.data ?? {};
        const profile: TutorProfile = {
          id: data.id,
          name: data.name,
          subject: data.subject || data.tutorProfile?.subject,
          category: data.category || data.tutorProfile?.category,
          pricePerHour: data.pricePerHour || data.tutorProfile?.hourlyRate,
          rating: data.rating || data.tutorProfile?.rating,
          reviewCount: data.reviewCount || data.tutorProfile?.reviewCount,
          bio: data.bio || data.tutorProfile?.bio,
          avatarUrl: data.avatarUrl || data.tutorProfile?.avatarUrl,
          location: data.location || data.tutorProfile?.location,
          mode: data.mode || data.tutorProfile?.mode || "Online",
          headline: data.headline || data.tutorProfile?.headline,
          badges: data.badges || data.tutorProfile?.badges,
        };
        setTutor(profile);

        const reviewsData: Review[] = (data.reviews || []).map((r: any, idx: number) => ({
          id: r.id || `review-${idx}`,
          reviewer: r.reviewer || r.author || "Learner",
          rating: r.rating || r.score || 0,
          comment: r.comment || r.text,
          date: r.date,
        }));
        setReviews(reviewsData);

        if (profile.category) {
          fetchRelated(profile.category, profile.id);
        }
      } catch (err: any) {
        console.error(err);
        setError("Tutor not found");
      } finally {
        setLoading(false);
      }
    };

    const fetchRelated = async (category: string, currentId: string) => {
      setRelatedLoading(true);
      try {
        const res = await get<any>(`/api/tutors?category=${encodeURIComponent(category)}&sort=rating_desc`);
        const list: TutorCardData[] = ((Array.isArray(res.data) ? res.data : res.data?.tutors || res.data?.data || []) as any[])
          .filter((t) => t.id !== currentId)
          .slice(0, 4)
          .map((t) => ({
            id: t.id,
            name: t.name,
            subject: t.subject || t.tutorProfile?.subject,
            category: t.category || t.tutorProfile?.category,
            pricePerHour: t.pricePerHour || t.tutorProfile?.hourlyRate,
            rating: t.rating || t.tutorProfile?.rating,
            bio: t.bio || t.tutorProfile?.bio,
            avatarUrl: t.avatarUrl || t.tutorProfile?.avatarUrl,
            location: t.location || t.tutorProfile?.location,
            mode: t.mode || t.tutorProfile?.mode || "Online",
          }));
        setRelated(list);
      } catch (err) {
        setRelated([]);
      } finally {
        setRelatedLoading(false);
      }
    };

    fetchTutor();
  }, [id]);

  const keyInfo = useMemo(() => {
    if (!tutor) return [];
    return [
      { label: "Experience", value: "5+ years mentoring" },
      { label: "Languages", value: "English" },
      { label: "Session format", value: tutor.mode || "Online" },
      { label: "Location", value: tutor.location },
      { label: "Response time", value: "Within 24h" },
      { label: "Focus area", value: tutor.subject || tutor.category },
    ];
  }, [tutor]);

  if (loading) {
    return (
      <PageContainer className="py-10">
        <LoadingGrid items={4} columns={4} />
      </PageContainer>
    );
  }

  if (error || !tutor) {
    return (
      <PageContainer className="py-10">
        <EmptyState
          title="Tutor not found"
          description="Try browsing other tutors."
          actionLabel="Browse tutors"
          actionHref="/tutors"
        />
      </PageContainer>
    );
  }

  return (
    <div className="space-y-8 py-10">
      <PageContainer>
        <TutorProfileHeader tutor={tutor} />
      </PageContainer>

      <TutorOverview
        bio={tutor.bio}
        teachingStyle={"Project-based sessions, live code reviews, and actionable next steps."}
        bestFor={"Learners who want accountability, real-world projects, and interview prep."}
        expertise={[tutor.subject || "", tutor.category || ""].filter(Boolean)}
      />

      <TutorKeyInfo items={keyInfo} />

      <TutorReviews reviews={reviews} />

      <RelatedTutors tutors={related} loading={relatedLoading} />
    </div>
  );
}
