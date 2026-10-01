"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Plus, Edit2, Trash2, Loader2, X, AlertCircle, Star } from "lucide-react";
import type { Project, ProjectCategory } from "@/types/database";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    category_id: "",
    short_description: "",
    description: "",
    location: "Calicut, Kerala",
    completion_year: "2025",
    client_name: "",
    scope_of_work: "Structural Analysis & RCC Design",
    cover_image_url: "" as string | null,
    cover_image_public_id: "" as string | null,
    display_order: 0,
    is_featured: false,
    is_active: true,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        fetch("/api/admin/crud?table=projects"),
        fetch("/api/admin/crud?table=project_categories"),
      ]);
      const pJson = await pRes.json();
      const cJson = await cRes.json();

      setProjects(pJson.data || []);
      setCategories(cJson.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingProject(null);
    setForm({
      title: "",
      slug: "",
      category_id: categories[0]?.id || "",
      short_description: "",
      description: "",
      location: "Calicut, Kerala",
      completion_year: "2025",
      client_name: "",
      scope_of_work: "Structural Design, Analysis & Detailing",
      cover_image_url: null,
      cover_image_public_id: null,
      display_order: projects.length + 1,
      is_featured: false,
      is_active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (p: Project) => {
    setEditingProject(p);
    setForm({
      title: p.title,
      slug: p.slug,
      category_id: p.category_id || "",
      short_description: p.short_description || "",
      description: p.description || "",
      location: p.location || "",
      completion_year: p.completion_year || "",
      client_name: p.client_name || "",
      scope_of_work: p.scope_of_work || "",
      cover_image_url: p.cover_image_url,
      cover_image_public_id: p.cover_image_public_id,
      display_order: p.display_order,
      is_featured: p.is_featured,
      is_active: p.is_active,
    });
    setModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setForm((prev) => ({
      ...prev,
      title: val,
      slug: editingProject ? prev.slug : slug,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        title: form.title,
        slug: form.slug,
        category_id: form.category_id || null,
        short_description: form.short_description,
        description: form.description,
        location: form.location,
        completion_year: form.completion_year,
        client_name: form.client_name,
        scope_of_work: form.scope_of_work,
        cover_image_url: form.cover_image_url,
        cover_image_public_id: form.cover_image_public_id,
        display_order: form.display_order,
        is_featured: form.is_featured,
        is_active: form.is_active,
      };

      const res = await fetch("/api/admin/crud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: "projects",
          id: editingProject?.id,
          item: payload,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Failed to save project");

      setModalOpen(false);
      fetchData();
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/admin/crud?table=projects&id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Failed to delete");
      fetchData();
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
            Section 05
          </div>
          <h1 className="text-3xl font-serif text-[#121418] font-normal tracking-tight">
            Projects Portfolio
          </h1>
          <p className="text-xs text-black/60 font-mono mt-1">
            Manage engineering project case studies, specifications, and photography
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#121418] hover:bg-black text-white text-xs font-mono uppercase tracking-[0.2em] font-bold transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-black/40" />
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => {
            const cat = categories.find((c) => c.id === proj.category_id);
            return (
              <div
                key={proj.id}
                className="bg-white border border-black/10 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full bg-[#121418]">
                    {proj.cover_image_url ? (
                      <Image
                        src={proj.cover_image_url}
                        alt={proj.title}
                        fill
                        sizes="380px"
                        className="object-cover object-center"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-white/30 font-mono text-xs">
                        No Cover Image
                      </div>
                    )}

                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      {cat && (
                        <span className="px-2 py-0.5 bg-black/75 text-white text-[9px] font-mono uppercase">
                          {cat.name}
                        </span>
                      )}
                      {proj.is_featured && (
                        <span className="px-2 py-0.5 bg-amber-500 text-black font-bold text-[9px] font-mono uppercase flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="text-lg font-serif font-bold text-[#121418] line-clamp-1">
                      {proj.title}
                    </h3>
                    <div className="flex items-center justify-between text-[11px] font-mono text-black/50">
                      <span>{proj.location || "Calicut"}</span>
                      <span>{proj.completion_year}</span>
                    </div>
                    {proj.short_description && (
                      <p className="text-xs text-black/60 line-clamp-2 pt-1 font-light">
                        {proj.short_description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-4 border-t border-black/10 flex items-center justify-between bg-black/[0.01]">
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 ${
                      proj.is_active ? "bg-emerald-100 text-emerald-800" : "bg-black/10 text-black/40"
                    }`}
                  >
                    {proj.is_active ? "Active" : "Hidden"}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(proj)}
                      className="p-1.5 hover:bg-black/10 text-black/70 hover:text-black"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(proj.id)}
                      className="p-1.5 hover:bg-red-50 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-16 border border-black/10 bg-white text-center space-y-3">
          <p className="font-serif text-lg text-black/60 italic">
            No projects published yet.
          </p>
          <p className="text-xs font-mono text-black/40">
            Click &quot;Add Project&quot; to publish engineering cases and upload architectural photography.
          </p>
        </div>
      )}

      {/* Add / Edit Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-black/15 max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-black/10 pb-4">
              <h2 className="text-lg font-serif text-[#121418]">
                {editingProject ? "Edit Project" : "Add New Project"}
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
              <div>
                <ImageUploader
                  label="Cover Architectural Photography (Cloudinary)"
                  currentImageUrl={form.cover_image_url}
                  currentPublicId={form.cover_image_public_id}
                  folder="maple-consulting/projects"
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
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-black/70 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Commercial Complex Meleparamba"
                  className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs font-serif text-base"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                    Project Category
                  </label>
                  <select
                    value={form.category_id}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                    className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs"
                  >
                    <option value="">Uncategorized</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-black/70 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="Calicut, Kerala"
                    className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-black/70 mb-1">
                    Year Completed
                  </label>
                  <input
                    type="text"
                    value={form.completion_year}
                    onChange={(e) => setForm({ ...form, completion_year: e.target.value })}
                    placeholder="2025"
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-black/70 mb-1">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={form.client_name}
                    onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                    placeholder="e.g. Skyline Ventures"
                    className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-black/70 mb-1">
                    Scope of Work
                  </label>
                  <input
                    type="text"
                    value={form.scope_of_work}
                    onChange={(e) => setForm({ ...form, scope_of_work: e.target.value })}
                    placeholder="e.g. Structural Assessment & Detailing"
                    className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-black/70 mb-1">
                  Short Summary
                </label>
                <textarea
                  rows={2}
                  value={form.short_description}
                  onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                  placeholder="Brief 1-2 sentence overview for cards..."
                  className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-black/70 mb-1">
                  Full Project Description
                </label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Detailed engineering case study, design challenges solved, earthquake load modeling..."
                  className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="proj_featured"
                    checked={form.is_featured}
                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="proj_featured" className="text-xs font-mono text-black/80">
                    Feature on Homepage
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="proj_active"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="proj_active" className="text-xs font-mono text-black/80">
                    Published (Active)
                  </label>
                </div>
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
                  {saving ? "Saving..." : "Save Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
