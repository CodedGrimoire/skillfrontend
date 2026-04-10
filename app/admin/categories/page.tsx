"use client";

import { useEffect, useState } from "react";
import { get } from "@/src/lib/api";
import { LoadingGrid } from "@/components/layout/LoadingGrid";
import { EmptyState } from "@/components/layout/EmptyState";

type Category = { id: string; name: string; usageCount?: number };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await get<Category[] | { categories?: Category[] }>("/api/admin/categories");
        const data = Array.isArray(res.data) ? res.data : (res.data as any)?.categories || [];
        setCategories(data);
      } catch (err) {
        setCategories([]);
        setError("Unable to load categories right now.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="text-sm text-white/70">Manage subjects across the platform.</p>
        </div>
        <button className="glass-btn cursor-not-allowed opacity-60" disabled title="Backend support required">
          Add category
        </button>
      </div>

      {loading ? (
        <LoadingGrid items={6} columns={3} />
      ) : error ? (
        <div className="glass-card px-4 py-3 text-sm text-rose-300 border-rose-500/30 bg-rose-500/10">{error}</div>
      ) : categories.length === 0 ? (
        <EmptyState
          title="No categories"
          description="Create categories once backend support is enabled."
          actionLabel="View tutors"
          actionHref="/tutors"
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div key={c.id} className="glass-card px-4 py-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-white font-semibold">{c.name}</p>
                <span className="text-xs text-white/60">{c.usageCount ?? 0} uses</span>
              </div>
              <div className="flex items-center justify-end gap-2 text-xs text-white/60">
                <button className="rounded-full border border-white/15 px-3 py-1 cursor-not-allowed opacity-60" disabled>
                  Edit
                </button>
                <button className="rounded-full border border-white/15 px-3 py-1 cursor-not-allowed opacity-60" disabled>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="glass-card px-4 py-3 text-xs text-white/60">
        Add/edit/delete actions are disabled until categories API supports mutations.
      </div>
    </div>
  );
}
