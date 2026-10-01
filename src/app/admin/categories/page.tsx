"use client";

import React, { useEffect, useState } from "react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Plus, Edit2, Trash2, Loader2, X, AlertCircle } from "lucide-react";
import type { ProjectCategory } from "@/types/database";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<ProjectCategory | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    cover_image_url: "" as string | null,
    cover_image_public_id: "" as string | null,
    display_order: 0,
    is_active: true,
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/crud?table=project_categories");
      const json = await res.json();
      setCategories(json.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingCat(null);
    setForm({
      name: "",
      slug: "",
      description: "",
      cover_image_url: null,
      cover_image_public_id: null,
      display_order: categories.length + 1,
      is_active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (cat: ProjectCategory) => {
    setEditingCat(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      cover_image_url: cat.cover_image_url,
      cover_image_public_id: cat.cover_image_public_id,
      display_order: cat.display_order,
      is_active: cat.is_active,
    });
    setModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setForm((prev) => ({
      ...prev,
      name: val,
      slug: editingCat ? prev.slug : slug,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/crud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: "project_categories",
          id: editingCat?.id,
          item: form,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Failed to save category");

      setModalOpen(false);
      fetchCategories();
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? Projects in this category will become unassigned."))
      return;
    try {
      const res = await fetch(`/api/admin/crud?table=project_categories&id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Failed to delete");
      fetchCategories();
    } catch (err: unknown) {
      const e = err as Error;
      alert(e.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-black/10 gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-black/50 mb-1">
            Section 05 Meta
          </div>
          <h1 className="text-3xl font-serif text-[#121418] font-normal tracking-tight">
            Project Categories
          </h1>
          <p className="text-xs text-black/60 font-mono mt-1">
            Define sectors: Commercial, Hospital, Educational, Residential, Others
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#121418] hover:bg-black text-white text-xs font-mono uppercase tracking-[0.2em] font-bold transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-black/40" />
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white border border-black/10 p-5 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-serif font-bold text-[#121418]">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] font-mono uppercase text-black/40">
                    Order: {cat.display_order}
                  </span>
                </div>
                <div className="text-xs font-mono text-black/50">{cat.slug}</div>
                {cat.description && (
                  <p className="text-xs text-black/60 pt-2 line-clamp-2">
                    {cat.description}
                  </p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-black/10 flex items-center justify-between">
                <span
                  className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 ${
                    cat.is_active ? "bg-emerald-100 text-emerald-800" : "bg-black/10 text-black/40"
                  }`}
                >
                  {cat.is_active ? "Active" : "Hidden"}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-1 hover:bg-black/10 text-black/70 hover:text-black"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-1 hover:bg-red-50 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 border border-black/10 bg-white text-center space-y-3">
          <p className="font-serif text-lg text-black/60 italic">
            No project categories configured yet.
          </p>
          <p className="text-xs font-mono text-black/40">
            Click &quot;Add Category&quot; to define project sectors (Commercial, Hospital, etc.).
          </p>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-black/15 max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/10 pb-4">
              <h2 className="text-lg font-serif text-[#121418]">
                {editingCat ? "Edit Category" : "Add Project Category"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-black/50 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-300 text-red-700 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <ImageUploader
                label="Category Showcase Cover (Cloudinary)"
                currentImageUrl={form.cover_image_url}
                currentPublicId={form.cover_image_public_id}
                folder="maple-consulting/categories"
                aspectRatio="aspect-[16/9]"
                onUploadSuccess={({ url, public_id }) => {
                  setForm({
                    ...form,
                    cover_image_url: url,
                    cover_image_public_id: public_id,
                  });
                }}
                onRemove={() => {
                  setForm({
                    ...form,
                    cover_image_url: null,
                    cover_image_public_id: null,
                  });
                }}
              />

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-black/70 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Commercial"
                  className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs font-serif text-base"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-black/70 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-black/70 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={form.display_order}
                  onChange={(e) =>
                    setForm({ ...form, display_order: parseInt(e.target.value) || 0 })
                  }
                  className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="cat_active"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="cat_active" className="text-xs font-mono text-black/80">
                  Active &amp; Published
                </label>
              </div>

              <div className="pt-4 border-t border-black/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-black/20 text-xs font-mono uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#121418] hover:bg-black text-white text-xs font-mono uppercase font-semibold disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
