"use client";

import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Loader2, X, AlertCircle } from "lucide-react";
import type { Branch } from "@/types/database";

export default function AdminBranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    map_url: "",
    display_order: 0,
    is_active: true,
  });

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/crud?table=branches", {
        cache: "no-store",
      });
      const json = await res.json();
      setBranches(json.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const openAddModal = () => {
    setEditingBranch(null);
    setForm({
      name: "",
      address: "",
      phone: "",
      email: "",
      map_url: "",
      display_order: branches.length + 1,
      is_active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (b: Branch) => {
    setEditingBranch(b);
    setForm({
      name: b.name,
      address: b.address || "",
      phone: b.phone || "",
      email: b.email || "",
      map_url: b.map_url || "",
      display_order: b.display_order,
      is_active: b.is_active,
    });
    setModalOpen(true);
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
          table: "branches",
          id: editingBranch?.id,
          item: form,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Failed to save branch");

      setModalOpen(false);
      fetchBranches();
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || "Failed to save branch");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this branch?")) return;
    try {
      const res = await fetch(`/api/admin/crud?table=branches&id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Failed to delete");
      fetchBranches();
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
            Section 06 &amp; Footer
          </div>
          <h1 className="text-3xl font-serif text-[#121418] font-normal tracking-tight">
            Consultancy Branches
          </h1>
          <p className="text-xs text-black/60 font-mono mt-1">
            Manage regional office branches across Kerala and Karnataka
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#121418] hover:bg-black text-white text-xs font-mono uppercase tracking-[0.2em] font-bold transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Branch</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-black/40" />
        </div>
      ) : branches.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((b) => (
            <div
              key={b.id}
              className="bg-white border border-black/10 p-5 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-serif font-bold text-[#121418]">{b.name}</h3>
                  <span className="text-[10px] font-mono text-black/40">
                    Order: {b.display_order}
                  </span>
                </div>
                {b.address && <p className="text-xs text-black/60">{b.address}</p>}
                {b.phone && (
                  <p className="text-xs font-mono text-black/70">Phone: {b.phone}</p>
                )}
                {b.email && (
                  <p className="text-xs font-mono text-black/70">Email: {b.email}</p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-black/10 flex items-center justify-between">
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 ${
                    b.is_active ? "bg-emerald-100 text-emerald-800" : "bg-black/10 text-black/40"
                  }`}
                >
                  {b.is_active ? "Active" : "Hidden"}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(b)}
                    className="p-1 hover:bg-black/10 text-black/70"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="p-1 hover:bg-red-50 text-red-500"
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
            No regional branches added yet.
          </p>
          <p className="text-xs font-mono text-black/40">
            Click &quot;Add Branch&quot; to configure office locations (Palakkad, Kochi, Bangalore, etc.).
          </p>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-black/15 max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/10 pb-4">
              <h2 className="text-lg font-serif text-[#121418]">
                {editingBranch ? "Edit Branch" : "Add Branch"}
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
                <label className="block text-[11px] font-mono uppercase tracking-wider text-black/70 mb-1">
                  Branch Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Koramangala (Bangalore)"
                  className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs font-serif text-base"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-black/70 mb-1">
                  Office Address
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Street, City, Pin"
                  className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-black/70 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91..."
                    className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-black/70 mb-1">
                    Order
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
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="branch@maple.com"
                  className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="branch_active"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="branch_active" className="text-xs font-mono text-black/80">
                  Visible on Website
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
                  {saving ? "Saving..." : "Save Branch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
