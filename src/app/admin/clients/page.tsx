"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Plus, Edit2, Trash2, Loader2, X, AlertCircle } from "lucide-react";
import type { Client } from "@/types/database";

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    logo_url: "" as string | null,
    logo_public_id: "" as string | null,
    website_url: "",
    display_order: 0,
    is_active: true,
  });

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/crud?table=clients", {
        cache: "no-store",
      });
      const json = await res.json();
      setClients(json.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const openAddModal = () => {
    setEditingClient(null);
    setForm({
      name: "",
      logo_url: null,
      logo_public_id: null,
      website_url: "",
      display_order: clients.length + 1,
      is_active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (client: Client) => {
    setEditingClient(client);
    setForm({
      name: client.name,
      logo_url: client.logo_url,
      logo_public_id: client.logo_public_id,
      website_url: client.website_url || "",
      display_order: client.display_order,
      is_active: client.is_active,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.logo_url) {
      setError("Please upload a client logo.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/crud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: "clients",
          id: editingClient?.id,
          item: form,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Failed to save client");

      setModalOpen(false);
      fetchClients();
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || "Failed to save client");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this client?")) return;
    try {
      const res = await fetch(`/api/admin/crud?table=clients&id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Failed to delete");
      fetchClients();
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
            Section 04
          </div>
          <h1 className="text-3xl font-serif text-[#121418] font-normal tracking-tight">
            Client Collaborations &amp; Logos
          </h1>
          <p className="text-xs text-black/60 font-mono mt-1">
            Manage client brand marks displayed in the 6-column partners showcase
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#121418] hover:bg-black text-white text-xs font-mono uppercase tracking-[0.2em] font-bold transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Client</span>
        </button>
      </div>

      {/* Grid of Logos */}
      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-black/40" />
        </div>
      ) : clients.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {clients.map((client) => (
            <div
              key={client.id}
              className="bg-white border border-black/10 p-5 flex flex-col items-center justify-between text-center relative group"
            >
              <div className="relative h-14 w-full mb-3 flex items-center justify-center">
                {client.logo_url ? (
                  <Image
                    src={client.logo_url}
                    alt={client.name}
                    fill
                    sizes="120px"
                    className="object-contain"
                  />
                ) : (
                  <span className="font-mono text-xs text-black/40">No Logo</span>
                )}
              </div>

              <div className="space-y-1 w-full border-t border-black/5 pt-2">
                <div className="text-xs font-semibold text-[#121418] truncate">
                  {client.name}
                </div>
                <div className="text-[10px] font-mono text-black/40">
                  Order: {client.display_order}
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-3 flex items-center gap-1">
                <button
                  onClick={() => openEditModal(client)}
                  className="p-1 hover:bg-black/5 text-black/70"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(client.id)}
                  className="p-1 hover:bg-red-50 text-red-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 border border-black/10 bg-white text-center space-y-3">
          <p className="font-serif text-lg text-black/60 italic">
            No client logos uploaded yet.
          </p>
          <p className="text-xs font-mono text-black/40">
            Click &quot;Add Client&quot; to upload brand partner logos.
          </p>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-black/15 max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/10 pb-4">
              <h2 className="text-lg font-serif text-[#121418]">
                {editingClient ? "Edit Client" : "Add Client Logo"}
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
                label="Client Logo"
                currentImageUrl={form.logo_url}
                currentPublicId={form.logo_public_id}
                folder="maple-consulting/clients"
                aspectRatio="aspect-[16/9]"
                onUploadSuccess={({ url, public_id }) => {
                  setForm((prev) => ({
                    ...prev,
                    logo_url: url,
                    logo_public_id: public_id,
                  }));
                }}
                onRemove={() => {
                  setForm((prev) => ({
                    ...prev,
                    logo_url: null,
                    logo_public_id: null,
                  }));
                }}
              />

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-black/70 mb-1">
                  Client / Company Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Apex Infrastructure Ltd."
                  className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-black/70 mb-1">
                  Website URL (Optional)
                </label>
                <input
                  type="url"
                  value={form.website_url}
                  onChange={(e) => setForm({ ...form, website_url: e.target.value })}
                  placeholder="https://..."
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
                  id="client_active"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="client_active" className="text-xs font-mono text-black/80">
                  Visible on Homepage
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
                  {saving ? "Saving..." : "Save Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
