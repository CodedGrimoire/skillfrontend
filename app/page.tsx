"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { get } from "@/src/lib/api";
import {
  SearchIcon,
  UserIcon,
  CalendarIcon,
  GraduationCapIcon,
  TargetIcon,
  HandshakeIcon,
  SparklesIcon,
  RocketIcon,
  LightbulbIcon,
  GlobeIcon,
  StarIcon,
} from "@/components/ui/Icons";

type Tutor = {
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

type Category = {
  id: string;
  name: string;
};

export default function Home() {
  const [featuredTutors, setFeaturedTutors] = useState<Tutor[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingTutors, setLoadingTutors] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    // Fetch featured tutors (top rated)
    const fetchTutors = async () => {
      try {
        const res = await get<{ success?: boolean; tutors?: Tutor[] } | Tutor[]>("/api/tutors?sort=rating_desc");
        const tutorsArray = Array.isArray(res.data) 
          ? res.data 
          : (res.data as any)?.tutors || (res.data as any)?.data || [];
        
        // Map to frontend format and take top 3
        const mappedTutors: Tutor[] = tutorsArray.slice(0, 3).map((tutor: any) => ({
          id: tutor.id,
          name: tutor.name,
          subject: tutor.subject || tutor.tutorProfile?.subject || "",
          category: tutor.category || tutor.tutorProfile?.category,
          pricePerHour: tutor.pricePerHour || tutor.tutorProfile?.hourlyRate,
          rating: tutor.rating || tutor.tutorProfile?.rating,
          bio: tutor.bio || tutor.tutorProfile?.bio,
          avatarUrl: tutor.avatarUrl || tutor.tutorProfile?.avatarUrl,
        }));
        
        setFeaturedTutors(mappedTutors);
      } catch (err) {
        console.error("Error fetching featured tutors:", err);
        setFeaturedTutors([]);
      } finally {
        setLoadingTutors(false);
      }
    };

    // Fetch categories
    const fetchCategories = async () => {
      try {
        const res = await get<{ success?: boolean; categories?: Category[] } | Category[]>("/api/categories");
        const categoriesArray = Array.isArray(res.data) 
          ? res.data 
          : (res.data as any)?.categories || (res.data as any)?.data || [];
        setCategories(Array.isArray(categoriesArray) ? categoriesArray : []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchTutors();
    fetchCategories();
  }, []);
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="relative overflow-hidden glass-card rounded-3xl px-6 py-16">
        <div className="absolute right-10 top-10 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl animate-pulse" />
        <div className="absolute left-10 bottom-10 h-48 w-48 rounded-full bg-purple-500/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="relative max-w-3xl space-y-6 z-10">
          <p className="text-sm uppercase tracking-[0.3em] text-white/70">
            SkillBridge
          </p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl glow-text">
            Connect with Expert Tutors, Learn Anything
          </h1>
          <p className="max-w-2xl text-lg text-white/80">
            Discover vetted tutors across technology, design, business, and more.
            Book personalized sessions and level up faster with guidance that fits
            your goals.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/tutors"
              className="glass-btn"
            >
              Browse Tutors
            </Link>
            <span className="text-sm text-white/70">
              300+ tutors ready to teach today
            </span>
          </div>
        </div>
      </section>

      {/* Search UI */}
      <section className="glass-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Find your tutor</h2>
            <p className="text-sm text-white/70">
              Search by subject, level, or tutor name. (UI only)
            </p>
          </div>
          <form className="flex w-full flex-col gap-3 sm:w-1/2 sm:flex-row">
            <input
              type="text"
              placeholder="What do you want to learn?"
              className="glass-input w-full"
            />
            <button
              type="button"
              className="glass-btn whitespace-nowrap"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Featured Tutors */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Featured Tutors</h2>
          <Link
            href="/tutors"
            className="text-sm font-medium text-white/70 underline-offset-4 hover:text-white hover:underline transition-colors"
          >
            See all
          </Link>
        </div>
        {loadingTutors ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="glass-card p-5 animate-pulse">
                <div className="h-12 w-12 rounded-full bg-white/10 mb-4" />
                <div className="h-4 w-24 bg-white/10 rounded mb-2" />
                <div className="h-3 w-32 bg-white/10 rounded mb-4" />
                <div className="h-3 w-20 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        ) : featuredTutors.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <p className="text-white/60">No featured tutors available.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTutors.map((tutor) => (
              <Link
                key={tutor.id}
                href={`/tutors/${tutor.id}`}
                className="glass-card p-5 hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-white/20 flex items-center justify-center text-white font-semibold">
                    {tutor.name?.[0]?.toUpperCase() || "T"}
                  </div>
                  {tutor.rating && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
                      {tutor.rating.toFixed(1)} <StarIcon className="h-3 w-3 fill-emerald-300" />
                    </span>
                  )}
                </div>
                <div className="mt-4 space-y-1">
                  <h3 className="text-lg font-semibold text-white">{tutor.name}</h3>
                  <p className="text-sm text-white/70">{tutor.subject || tutor.category || "Tutor"}</p>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-white/80">
                  <span>{tutor.pricePerHour ? `$${tutor.pricePerHour}/hr` : "Price on request"}</span>
                  <span className="text-white hover:text-white/80 underline underline-offset-4 transition-colors">
                    View Profile
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">
          Popular Categories
        </h2>
        {loadingCategories ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="glass-card px-5 py-4 h-12 animate-pulse bg-white/5" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="glass-card px-5 py-4 text-center">
            <p className="text-white/60">No categories available.</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/tutors?category=${encodeURIComponent(category.name)}`}
                className="glass-card px-5 py-4 text-sm font-medium text-white text-center hover:scale-105 transition-transform cursor-pointer hover:border-white/30"
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="space-y-8 scroll-mt-10">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-white">How It Works</h2>
          <p className="text-white/70">
            Getting started with SkillBridge is simple. Follow these four easy steps
            to begin your learning journey with expert tutors.
          </p>
        </div>
        <div className="space-y-6">
          {[
            {
              number: "1",
              title: "Browse & Discover",
              description:
                "Explore our curated list of expert tutors across various subjects. Filter by category, price, ratings, and availability to find the perfect match for your learning goals.",
              Icon: SearchIcon,
            },
            {
              number: "2",
              title: "Choose Your Tutor",
              description:
                "Review tutor profiles, read student reviews, and check their availability. Each tutor profile includes their expertise, hourly rate, ratings, and teaching style.",
              Icon: UserIcon,
            },
            {
              number: "3",
              title: "Book a Session",
              description:
                "Select your preferred date and time slot from the tutor's availability. Confirm your booking and receive instant confirmation with all session details.",
              Icon: CalendarIcon,
            },
            {
              number: "4",
              title: "Learn & Grow",
              description:
                "Attend your personalized session via video call or in-person (if available). Get hands-on guidance, ask questions, and accelerate your learning journey.",
              Icon: GraduationCapIcon,
            },
          ].map((step, index) => {
            const IconComponent = step.Icon;
            return (
              <div
                key={step.number}
                className="glass-card"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="flex items-center gap-4 sm:flex-col sm:items-start">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-lg font-semibold text-white shadow-lg glow-border">
                      {step.number}
                    </div>
                    <div className="text-white/60 sm:hidden">
                      <IconComponent className="h-8 w-8" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="hidden text-white/60 sm:inline">
                        <IconComponent className="h-6 w-6" />
                      </span>
                      <h3 className="text-xl font-semibold text-white">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-white/80 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* About */}
      <section id="about" className="space-y-8 scroll-mt-10">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-white">About SkillBridge</h2>
          <p className="text-white/70">
            Connecting passionate learners with expert tutors to create meaningful
            learning experiences that drive real results.
          </p>
        </div>

        {/* Mission */}
        <div className="glass-card">
          <h3 className="text-xl font-semibold text-white mb-3">Our Mission</h3>
          <p className="text-white/80 leading-relaxed">
            At SkillBridge, we believe that personalized, one-on-one learning is the
            most effective way to master new skills. Our platform bridges the gap
            between students seeking knowledge and tutors who are passionate about
            teaching. We're committed to creating a community where expertise meets
            ambition, and where every learning journey is supported by dedicated
            professionals.
          </p>
        </div>

        {/* Values */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Our Values</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                Icon: TargetIcon,
                title: "Quality First",
                description:
                  "We carefully vet all tutors to ensure they meet our high standards for expertise and teaching ability.",
              },
              {
                Icon: HandshakeIcon,
                title: "Community Driven",
                description:
                  "Building a supportive learning community where students and tutors can grow together.",
              },
              {
                Icon: SparklesIcon,
                title: "Personalized Learning",
                description:
                  "Every session is tailored to your unique learning style, pace, and goals.",
              },
              {
                Icon: RocketIcon,
                title: "Innovation",
                description:
                  "Continuously improving our platform to make learning more accessible and effective.",
              },
              {
                Icon: LightbulbIcon,
                title: "Transparency",
                description:
                  "Clear pricing, honest reviews, and open communication between students and tutors.",
              },
              {
                Icon: GlobeIcon,
                title: "Accessibility",
                description:
                  "Making quality education accessible to everyone, regardless of location or background.",
              },
            ].map((value) => {
              const IconComponent = value.Icon;
              return (
                <div
                  key={value.title}
                  className="glass-card p-5"
                >
                  <div className="mb-3 text-white/60">
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {value.title}
                  </h4>
                  <p className="text-sm text-white/70">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="glass-card p-8 glow-border">
          <h3 className="text-xl font-semibold mb-6 text-white">SkillBridge by the Numbers</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="text-3xl font-semibold mb-1 text-white glow-text">300+</div>
              <div className="text-sm text-white/70">Expert Tutors</div>
            </div>
            <div>
              <div className="text-3xl font-semibold mb-1 text-white glow-text">5,000+</div>
              <div className="text-sm text-white/70">Students Served</div>
            </div>
            <div>
              <div className="text-3xl font-semibold mb-1 text-white glow-text">10,000+</div>
              <div className="text-sm text-white/70">Sessions Completed</div>
            </div>
            <div>
              <div className="text-3xl font-semibold mb-1 text-white glow-text">4.8</div>
              <div className="text-sm text-white/70">Average Rating</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
