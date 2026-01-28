"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { get } from "@/src/lib/api";
import { StarIcon } from "@/components/ui/Icons";

type Tutor = {
  id: string;
  name: string;
  subject: string;
  category?: string;
  pricePerHour?: number;
  rating?: number;
  bio?: string;
  avatarUrl?: string;
};

type Filters = {
  category: string;
  minPrice: string;
  maxPrice: string;
  sort: "rating_desc" | "rating_asc";
};

const initialFilters: Filters = {
  category: "",
  minPrice: "",
  maxPrice: "",
  sort: "rating_desc",
};

export default function TutorsPage() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.category) params.append("category", filters.category);
    if (filters.minPrice) params.append("minPrice", filters.minPrice);
    if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
    if (filters.sort) params.append("sort", filters.sort);
    return params.toString() ? `?${params.toString()}` : "";
  }, [filters]);

  useEffect(() => {
    const fetchTutors = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await get<{ tutors?: Tutor[] } | Tutor[]>(
          `/api/tutors${queryString}`,
        );
        console.log("API RESPONSE:", res.data);
        const payload: any = res.data ?? {};
        
        // Handle different response formats
        let list: Tutor[] = [];
        if (Array.isArray(payload)) {
          list = payload;
        } else if (Array.isArray(payload.tutors)) {
          list = payload.tutors;
        } else if (Array.isArray(payload.data)) {
          list = payload.data;
        } else if (Array.isArray(payload.items)) {
          list = payload.items;
        }
        
        // Map backend response structure to frontend Tutor type
        const mappedTutors: Tutor[] = list.map((tutor: any) => ({
          id: tutor.id,
          name: tutor.name,
          subject: tutor.subject || tutor.tutorProfile?.subject || "",
          category: tutor.category || tutor.tutorProfile?.category,
          pricePerHour: tutor.pricePerHour || tutor.tutorProfile?.hourlyRate,
          rating: tutor.rating || tutor.tutorProfile?.rating,
          bio: tutor.bio || tutor.tutorProfile?.bio,
          avatarUrl: tutor.avatarUrl || tutor.tutorProfile?.avatarUrl,
        }));
        
        setTutors(mappedTutors);
      } catch (err) {
        console.error("Error fetching tutors:", err);
        setError("Could not load tutors. Please try again.");
        setTutors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, [queryString]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Browse Tutors</h1>
        <p className="text-sm text-white/70">
          Filter by category, price, and ratings to find the right expert.
        </p>
      </header>

      {/* Filters */}
      <section className="glass-card">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Category</label>
            <input
              type="text"
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              placeholder="e.g., Web Development"
              className="glass-input w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Min Price</label>
            <input
              type="number"
              min={0}
              value={filters.minPrice}
              onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              placeholder="$"
              className="glass-input w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Max Price</label>
            <input
              type="number"
              min={0}
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              placeholder="$"
              className="glass-input w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Sort</label>
            <select
              value={filters.sort}
              onChange={(e) =>
                handleFilterChange("sort", e.target.value as Filters["sort"])
              }
              className="glass-input w-full"
            >
              <option value="rating_desc" className="bg-[#0a0e27]">Rating: High to Low</option>
              <option value="rating_asc" className="bg-[#0a0e27]">Rating: Low to High</option>
            </select>
          </div>
        </div>
      </section>

      {/* Content */}
      {loading ? (
        <SkeletonGrid />
      ) : error ? (
        <div className="glass-card px-4 py-3 text-sm text-rose-300 border-rose-500/30 bg-rose-500/10">
          {error}
        </div>
      ) : tutors.length === 0 ? (
        <div className="glass-card px-4 py-6 text-sm text-white/70 text-center">
          No tutors found. Try adjusting your filters.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tutors.map((tutor) => (
            <Link
              key={tutor.id}
              href={`/tutors/${tutor.id}`}
              className="group glass-card p-5"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-white/20" />
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-white/90 transition-colors">
                    {tutor.name}
                  </h3>
                  <p className="text-sm text-white/70">{tutor.subject}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-white/80">
                <span>{tutor.category ?? "General"}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
                  {tutor.rating ? (
                    <>
                      {tutor.rating.toFixed(1)} <StarIcon className="h-3 w-3 fill-emerald-300" />
                    </>
                  ) : (
                    "New"
                  )}
                </span>
              </div>
              <div className="mt-3 text-sm text-white/80">
                {tutor.pricePerHour ? `$${tutor.pricePerHour}/hr` : "Pricing on request"}
              </div>
              {tutor.bio && (
                <p className="mt-3 line-clamp-3 text-sm text-white/70">{tutor.bio}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          className="animate-pulse glass-card p-5"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-white/10" />
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-white/10" />
              <div className="h-3 w-24 rounded bg-white/10" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="h-3 w-20 rounded bg-white/10" />
            <div className="h-6 w-16 rounded-full bg-white/10" />
          </div>
          <div className="mt-3 h-3 w-24 rounded bg-white/10" />
          <div className="mt-3 space-y-2">
            <div className="h-3 w-full rounded bg-white/10" />
            <div className="h-3 w-3/4 rounded bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}
