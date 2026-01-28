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
      const res = await get<Category[]>("/api/admin/categories");
      setCategories(res.data);
    } catch (err) {
      setError("Unable to load categories.");
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
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">Categories</h1>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Add a category"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-inner outline-none transition focus:border-slate-400 focus:bg-slate-50"
          />
          <button
            type="button"
            onClick={addCategory}
            disabled={saving}
            className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <span className="inline-flex items-center gap-2">
                <Spinner size={14} />
                Saving...
              </span>
            ) : (
              "Add"
            )}
          </button>
        </div>
        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="h-10 rounded-xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-sm text-slate-600">No categories yet.</p>
        ) : (
          <div className="space-y-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-800"
              >
                <span>{cat.name}</span>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  disabled={saving}
                  className="text-xs font-semibold text-rose-700 underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-60"
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
