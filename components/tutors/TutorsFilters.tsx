import { useState } from "react";
import { SectionHeader } from "@/components/layout/SectionHeader";

export type Filters = {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  sort: string;
  mode: string;
  rating: string;
};

interface Props {
  filters: Filters;
  categories: string[];
  onChange: (key: keyof Filters, value: string) => void;
  onClear: () => void;
  onSubmit: () => void;
  total: number;
}

export function TutorsFilters({ filters, categories, onChange, onClear, onSubmit, total }: Props) {
  const [showMobile, setShowMobile] = useState(false);

  const FilterContent = (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-white/70">Search</label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange("search", e.target.value)}
          placeholder="Name, subject, keyword"
          className="glass-input w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-white/70">Category</label>
        <select
          value={filters.category}
          onChange={(e) => onChange("category", e.target.value)}
          className="glass-input w-full"
        >
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c} value={c} className="bg-[#0a0e27]">
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-white/70">Min price</label>
          <input
            type="number"
            min={0}
            value={filters.minPrice}
            onChange={(e) => onChange("minPrice", e.target.value)}
            className="glass-input w-full"
            placeholder="$"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-white/70">Max price</label>
          <input
            type="number"
            min={0}
            value={filters.maxPrice}
            onChange={(e) => onChange("maxPrice", e.target.value)}
            className="glass-input w-full"
            placeholder="$"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-white/70">Minimum rating</label>
        <select
          value={filters.rating}
          onChange={(e) => onChange("rating", e.target.value)}
          className="glass-input w-full"
        >
          <option value="">Any</option>
          {[4.5, 4.0, 3.5].map((r) => (
            <option key={r} value={r} className="bg-[#0a0e27]">
              {r}+
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-white/70">Session mode</label>
        <select
          value={filters.mode}
          onChange={(e) => onChange("mode", e.target.value)}
          className="glass-input w-full"
        >
          <option value="">Any</option>
          <option value="Online" className="bg-[#0a0e27]">Online</option>
          <option value="In person" className="bg-[#0a0e27]">In person</option>
          <option value="Hybrid" className="bg-[#0a0e27]">Hybrid</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-white/70">Sort by</label>
        <select
          value={filters.sort}
          onChange={(e) => onChange("sort", e.target.value)}
          className="glass-input w-full"
        >
          <option value="rating_desc" className="bg-[#0a0e27]">Highest rated</option>
          <option value="price_asc" className="bg-[#0a0e27]">Lowest price</option>
          <option value="price_desc" className="bg-[#0a0e27]">Highest price</option>
          <option value="name_asc" className="bg-[#0a0e27]">Name A-Z</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          className="glass-btn text-sm"
          onClick={onSubmit}
          type="button"
        >
          Apply filters
        </button>
        <button
          className="glass-btn-secondary text-sm"
          onClick={onClear}
          type="button"
        >
          Clear
        </button>
        <span className="text-xs text-white/60 self-center">{total} tutors</span>
      </div>
    </div>
  );

  return (
    <div className="lg:w-72 shrink-0">
      <div className="hidden lg:block glass-card sticky top-24 p-5 space-y-4">
        <SectionHeader eyebrow="Filters" title="Refine" />
        {FilterContent}
      </div>

      <div className="lg:hidden">
        <button
          className="glass-btn-secondary w-full text-sm"
          onClick={() => setShowMobile((v) => !v)}
        >
          {showMobile ? "Hide filters" : "Show filters"}
        </button>
        {showMobile && (
          <div className="mt-3 glass-card p-4 space-y-4">
            {FilterContent}
          </div>
        )}
      </div>
    </div>
  );
}
