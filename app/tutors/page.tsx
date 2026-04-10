"use client";

import { useEffect, useMemo, useState } from "react";
import { get } from "@/src/lib/api";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { LoadingGrid } from "@/components/layout/LoadingGrid";
import { EmptyState } from "@/components/layout/EmptyState";
import { TutorsFilters, Filters } from "@/components/tutors/TutorsFilters";
import { TutorCard, TutorCardData } from "@/components/tutors/TutorCard";
import { PaginationControls } from "@/components/tutors/PaginationControls";

const initialFilters: Filters = {
  search: "",
  category: "",
  minPrice: "",
  maxPrice: "",
  sort: "rating_desc",
  mode: "",
  rating: "",
};

type Tutor = {
  id: string;
  name: string;
  subject: string;
  category?: string;
  pricePerHour?: number;
  rating?: number;
  bio?: string;
  avatarUrl?: string;
  location?: string;
  mode?: string;
};

type Category = { id: string; name: string };

export default function TutorsPage() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await get<{ categories?: Category[] } | Category[]>("/api/categories");
        const categoriesArray = Array.isArray(res.data)
          ? res.data
          : (res.data as any)?.categories || (res.data as any)?.data || [];
        setCategories(Array.isArray(categoriesArray) ? categoriesArray : []);
      } catch (err) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchTutors = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (filters.search) params.append("search", filters.search);
        if (filters.category) params.append("category", filters.category);
        if (filters.minPrice) params.append("minPrice", filters.minPrice);
        if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
        if (filters.sort) params.append("sort", filters.sort);
        const res = await get<{ tutors?: Tutor[] } | Tutor[]>(`/api/tutors${params.toString() ? `?${params.toString()}` : ""}`);
        const payload: any = res.data ?? {};

        let list: Tutor[] = [];
        if (Array.isArray(payload)) list = payload;
        else if (Array.isArray(payload.tutors)) list = payload.tutors;
        else if (Array.isArray(payload.data)) list = payload.data;
        else if (Array.isArray(payload.items)) list = payload.items;

        const mapped: Tutor[] = list.map((t: any) => ({
          id: t.id,
          name: t.name,
          subject: t.subject || t.tutorProfile?.subject || "",
          category: t.category || t.tutorProfile?.category,
          pricePerHour: t.pricePerHour || t.tutorProfile?.hourlyRate,
          rating: t.rating || t.tutorProfile?.rating,
          bio: t.bio || t.tutorProfile?.bio,
          avatarUrl: t.avatarUrl || t.tutorProfile?.avatarUrl,
          location: t.location || t.tutorProfile?.location || "Remote",
          mode: t.mode || t.tutorProfile?.mode || "Online",
        }));

        setTutors(mapped);
      } catch (err) {
        console.error("Error fetching tutors:", err);
        setError("Could not load tutors. Please try again.");
        setTutors([]);
      } finally {
        setLoading(false);
        setPage(1);
      }
    };

    fetchTutors();
  }, [filters.search, filters.category, filters.minPrice, filters.maxPrice, filters.sort]);

  const clientFiltered = useMemo(() => {
    const term = filters.search.trim().toLowerCase();
    return tutors.filter((tutor) => {
      const matchesSearch = term
        ? [tutor.name, tutor.subject, tutor.category, tutor.bio]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(term)
        : true;

      const price = tutor.pricePerHour ?? 0;
      const minOk = filters.minPrice ? price >= Number(filters.minPrice) : true;
      const maxOk = filters.maxPrice ? price <= Number(filters.maxPrice) : true;
      const ratingOk = filters.rating ? (tutor.rating ?? 0) >= Number(filters.rating) : true;
      const modeOk = filters.mode ? (tutor.mode || "Online").toLowerCase().includes(filters.mode.toLowerCase()) : true;
      const categoryOk = filters.category ? (tutor.category || "").toLowerCase() === filters.category.toLowerCase() : true;

      return matchesSearch && minOk && maxOk && ratingOk && modeOk && categoryOk;
    });
  }, [tutors, filters]);

  const sorted = useMemo(() => {
    const list = [...clientFiltered];
    switch (filters.sort) {
      case "price_asc":
        return list.sort((a, b) => (a.pricePerHour ?? Infinity) - (b.pricePerHour ?? Infinity));
      case "price_desc":
        return list.sort((a, b) => (b.pricePerHour ?? 0) - (a.pricePerHour ?? 0));
      case "name_asc":
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case "rating_desc":
      default:
        return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }
  }, [clientFiltered, filters.sort]);

  const total = sorted.length;
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleClear = () => {
    setFilters(initialFilters);
    setPage(1);
  };

  return (
    <PageContainer className="py-10">
      <SectionHeader
        eyebrow="Tutors"
        title="Explore experts ready to help"
        description="Search, filter, and sort tutors by expertise, rating, price, and mode."
      />

      <div className="mt-8 flex flex-col gap-6 lg:flex-row">
        <TutorsFilters
          filters={filters}
          categories={categories.map((c) => c.name)}
          onChange={handleFilterChange}
          onClear={handleClear}
          onSubmit={() => setPage(1)}
          total={total}
        />

        <div className="flex-1 min-w-0">
          {loading ? (
            <LoadingGrid items={8} columns={4} />
          ) : error ? (
            <div className="glass-card px-4 py-3 text-sm text-rose-300 border-rose-500/30 bg-rose-500/10">
              {error}
            </div>
          ) : total === 0 ? (
            <EmptyState
              title="No tutors match your filters"
              description="Adjust filters or search for another subject."
              actionLabel="Clear filters"
              actionHref="/tutors"
            />
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {paginated.map((tutor) => (
                  <TutorCard key={tutor.id} tutor={tutor as TutorCardData} />
                ))}
              </div>
              <PaginationControls page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
            </>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
