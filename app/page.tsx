"use client";

import { useEffect, useState } from "react";
import { get } from "@/src/lib/api";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { FeaturedTutorsSection } from "@/components/home/FeaturedTutorsSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { FormatsSection } from "@/components/home/FormatsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { DualCTASection } from "@/components/home/DualCTASection";
import { FaqSection } from "@/components/home/FaqSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { ResourcesSection } from "@/components/home/ResourcesSection";

export type Tutor = {
  id: string;
  name: string;
  subject?: string;
  category?: string;
  pricePerHour?: number;
  rating?: number;
  bio?: string;
  avatarUrl?: string;
  tutorProfile?: {
    hourlyRate?: number;
    rating?: number;
    subject?: string;
    category?: string;
  };
};

type Category = { id: string; name: string };

export default function Home() {
  const [featuredTutors, setFeaturedTutors] = useState<Tutor[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingTutors, setLoadingTutors] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await get<{ tutors?: Tutor[] } | Tutor[]>("/api/tutors?sort=rating_desc");
        const tutorsArray = Array.isArray(res.data)
          ? res.data
          : (res.data as any)?.tutors || (res.data as any)?.data || [];
        const mapped: Tutor[] = tutorsArray.slice(0, 4).map((t: any) => ({
          id: t.id,
          name: t.name,
          subject: t.subject || t.tutorProfile?.subject || "",
          category: t.category || t.tutorProfile?.category,
          pricePerHour: t.pricePerHour || t.tutorProfile?.hourlyRate,
          rating: t.rating || t.tutorProfile?.rating,
          bio: t.bio || t.tutorProfile?.bio,
          avatarUrl: t.avatarUrl || t.tutorProfile?.avatarUrl,
        }));
        setFeaturedTutors(mapped);
      } catch (err) {
        setFeaturedTutors([]);
      } finally {
        setLoadingTutors(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await get<{ categories?: Category[] } | Category[]>("/api/categories");
        const categoriesArray = Array.isArray(res.data)
          ? res.data
          : (res.data as any)?.categories || (res.data as any)?.data || [];
        setCategories(Array.isArray(categoriesArray) ? categoriesArray : []);
      } catch (err) {
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchTutors();
    fetchCategories();
  }, []);

  return (
    <div className="space-y-4">
      <HeroSection />
      <StatsSection />
      <FeaturedTutorsSection tutors={featuredTutors} loading={loadingTutors} />
      <CategoriesSection categories={categories} loading={loadingCategories} />
      <HowItWorksSection />
      <BenefitsSection />
      <FormatsSection />
      <TestimonialsSection />
      <DualCTASection />
      <FaqSection />
      <ResourcesSection />
      <NewsletterSection />
    </div>
  );
}
