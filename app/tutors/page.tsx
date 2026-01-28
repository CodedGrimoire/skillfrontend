"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { get } from "@/src/lib/api";

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
        const res = await get<Tutor[]>(`/api/tutors${queryString}`);
        setTutors(res.data);
      } catch (err) {
        setError("Could not load tutors. Please try again.");
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
        <h1 className="text-2xl font-semibold text-slate-900">Browse Tutors</h1>
        <p className="text-sm text-slate-600">
          Filter by category, price, and ratings to find the right expert.
        </p>
      </header>

      {/* Filters */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-800">Category</label>
            <input
              type="text"
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              placeholder="e.g., Web Development"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-inner outline-none transition focus:border-slate-400 focus:bg-slate-50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-800">Min Price</label>
            <input
              type="number"
              min={0}
              value={filters.minPrice}
              onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              placeholder="$"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-inner outline-none transition focus:border-slate-400 focus:bg-slate-50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-800">Max Price</label>
            <input
              type="number"
              min={0}
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              placeholder="$"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-inner outline-none transition focus:border-slate-400 focus:bg-slate-50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-800">Sort</label>
            <select
              value={filters.sort}
              onChange={(e) =>
                handleFilterChange("sort", e.target.value as Filters["sort"])
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-inner outline-none transition focus:border-slate-400 focus:bg-slate-50"
            >
              <option value="rating_desc">Rating: High to Low</option>
              <option value="rating_asc">Rating: Low to High</option>
            </select>
          </div>
        </div>
      </section>

      {/* Content */}
      {loading ? (
        <SkeletonGrid />
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : tutors.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-700">
          No tutors found. Try adjusting your filters.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tutors.map((tutor) => (
            <Link
              key={tutor.id}
              href={`/tutors/${tutor.id}`}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-slate-200 to-slate-100" />
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-slate-800">
                    {tutor.name}
                  </h3>
                  <p className="text-sm text-slate-600">{tutor.subject}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-700">
                <span>{tutor.category ?? "General"}</span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {tutor.rating ? `${tutor.rating.toFixed(1)} ★` : "New"}
                </span>
              </div>
              <div className="mt-3 text-sm text-slate-700">
                {tutor.pricePerHour ? `$${tutor.pricePerHour}/hr` : "Pricing on request"}
              </div>
              {tutor.bio && (
                <p className="mt-3 line-clamp-3 text-sm text-slate-600">{tutor.bio}</p>
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
          className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-slate-200" />
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-slate-200" />
              <div className="h-3 w-24 rounded bg-slate-200" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="h-3 w-20 rounded bg-slate-200" />
            <div className="h-6 w-16 rounded-full bg-slate-200" />
          </div>
          <div className="mt-3 h-3 w-24 rounded bg-slate-200" />
          <div className="mt-3 space-y-2">
            <div className="h-3 w-full rounded bg-slate-200" />
            <div className="h-3 w-3/4 rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
