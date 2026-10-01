"use client";

import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Check, X, Loader2, AlertCircle } from "lucide-react";
import type { Service } from "@/types/database";

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    number_label: "01",
    title: "",
    slug: "",
    short_description: "",
    description: "",
    display_order: 0,
    is_active: true,
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/crud?table=services");
      const json = await res.json();
      setServices(json.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAddModal = () => {
    setEditingService(null);
    const nextNum = String(services.length + 1).padStart(2, "0");
    setForm({
      number_label: nextNum,
      title: "",
      slug: "",
      short_description: "",
      description: "",
      display_order: services.length + 1,
      is_active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setForm({
      number_label: service.number_label || "",
      title: service.title,
      slug: service.slug,
      short_description: service.short_description || "",
      description: service.description || "",
      display_order: service.display_order,
      is_active: service.is_active,
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
      slug: editingService ? prev.slug : slug,
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
          table: "services",
          id: editingService?.id,
          item: form,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to save service");
      }

      setModalOpen(false);
      fetchServices();
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || "Failed to save service");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      const res = await fetch(`/api/admin/crud?table=services&id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Failed to delete");
      fetchServices();
    } catch (err: unknown) {
      const e = err as Error;
      alert(e.message || "Failed to delete");
    }
  };

  const toggleActive = async (service: Service) => {
    try {
      await fetch("/api/admin/crud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: "services",
          id: service.id,
          item: { ...service, is_active: !service.is_active },
        }),
      });
      fetchServices();
    } catch (err: unknown) {
      const e = err as Error;
      alert(e.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-black/10 gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-black/50 mb-1">
            Section 02
          </div>
          <h1 className="text-3xl font-serif text-[#121418] font-normal tracking-tight">
            Consultancy Services
          </h1>
          <p className="text-xs text-black/60 font-mono mt-1">
            Manage the numbered services accordion displayed on the homepage
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#121418] hover:bg-black text-white text-xs font-mono uppercase tracking-[0.2em] font-bold transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>

      {/* Services List Table */}
      <div className="bg-white border border-black/10 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <Loader2 className="w-8 h-8 animate-spin text-black/40" />
          </div>
        ) : services.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/[0.03] border-b border-black/10 text-[10px] font-mono uppercase tracking-wider text-black/60">
                <tr>
                  <th className="py-3.5 px-4 w-16">#</th>
                  <th className="py-3.5 px-4">Service Title</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4 w-24">Order</th>
                  <th className="py-3.5 px-4 w-28">Status</th>
                  <th className="py-3.5 px-4 text-right w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {services.map((item) => (
                  <tr key={item.id} className="hover:bg-black/[0.01] transition-colors">
                    <td className="py-4 px-4 font-mono font-semibold text-black/70">
                      {item.number_label || "—"}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-[#121418]">{item.title}</div>
                      {item.description && (
                        <p className="text-[11px] text-black/50 line-clamp-1 mt-0.5 max-w-md">
                          {item.description}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-4 font-mono text-black/50 text-[11px]">
                      {item.slug}
                    </td>
                    <td className="py-4 px-4 font-mono">{item.display_order}</td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => toggleActive(item)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider ${
                          item.is_active
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-black/10 text-black/50"
                        }`}
                      >
                        {item.is_active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>{item.is_active ? "Active" : "Inactive"}</span>
                      </button>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 hover:bg-black/5 text-black/70 hover:text-black"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 hover:bg-red-50 text-red-500 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center space-y-4">
            <p className="font-serif text-lg text-black/60 italic">
              No services added to the database yet.
            </p>
            <p className="text-xs font-mono text-black/40">
              Click &quot;Add Service&quot; above to create your first civil &amp; structural engineering capability.
            </p>
          </div>
        )}
      </div>

      {/* Add / Edit Service Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-black/15 max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/10 pb-4">
              <h2 className="text-lg font-serif text-[#121418]">
                {editingService ? "Edit Service" : "Add New Service"}
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
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-black/70 mb-1">
                    Number (e.g. 01)
                  </label>
                  <input
                    type="text"
                    required
                    value={form.number_label}
                    onChange={(e) => setForm({ ...form, number_label: e.target.value })}
                    className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs font-mono"
                  />
                </div>
                <div className="col-span-2">
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

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-black/70 mb-1">
                  Service Title
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Structural Engineering"
                  className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs"
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
                  Accordion Description
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Detailed structural engineering description shown when accordion item expands..."
                  className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="is_active" className="text-xs font-mono text-black/80">
                  Publish to Website (Active)
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
                  {saving ? "Saving..." : "Save Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
