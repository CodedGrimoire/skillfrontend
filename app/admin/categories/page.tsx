"use client";

import { useEffect, useState } from "react";
import { get, post } from "@/src/lib/api";
import api from "@/src/lib/api";
import { useToast } from "@/src/context/ToastContext";
import { Spinner } from "@/components/ui/Spinner";

type Category = {
  id: string;
  name: string;
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const fetchCategories = async () => {
    setError(null);
    try {
      const res = await get<{ success?: boolean; categories?: Category[] } | Category[]>("/api/admin/categories");
      // Handle both wrapped and unwrapped responses
      const categoriesArray = Array.isArray(res.data) 
        ? res.data 
        : (res.data as any)?.categories || (res.data as any)?.data || [];
      setCategories(Array.isArray(categoriesArray) ? categoriesArray : []);
    } catch (err) {
      setError("Unable to load categories.");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await post("/api/admin/categories", { name: newCategory.trim() });
      setNewCategory("");
      await fetchCategories();
      showToast("Category added", "success");
    } catch (err) {
      setError("Failed to add category.");
      showToast("Add failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (id: string) => {
    setSaving(true);
    setError(null);
    try {
      await api.delete(`/api/admin/categories/${id}`);
      await fetchCategories();
      showToast("Category deleted", "success");
    } catch (err) {
      setError("Failed to delete category.");
      showToast("Delete failed", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-white glow-text">Categories</h1>
        <p className="text-sm text-white/70">Manage subject categories</p>
      </header>
      
      <div className="glass-card space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCategory()}
            placeholder="Add a category"
            className="glass-input flex-1"
          />
          <button
            type="button"
            onClick={addCategory}
            disabled={saving || !newCategory.trim()}
            className="glass-btn px-6 py-3 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <span className="inline-flex items-center gap-2">
                <Spinner size={14} />
                Saving...
              </span>
            ) : (
              "Add Category"
            )}
          </button>
        </div>
        
        {error && (
          <div className="glass-card px-6 py-4 border-rose-500/30 bg-rose-500/10">
            <p className="text-sm text-rose-300">{error}</p>
          </div>
        )}
        
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="h-14 glass rounded-xl animate-pulse border border-white/10" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-white/60">No categories yet. Add one above!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="glass p-4 rounded-xl border border-white/10 flex items-center justify-between hover:border-white/20 transition-all"
              >
                <span className="text-white font-medium">{cat.name}</span>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  disabled={saving}
                  className="text-xs font-semibold text-rose-300 hover:text-rose-200 underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
