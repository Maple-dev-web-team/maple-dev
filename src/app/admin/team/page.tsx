"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Plus, Edit2, Trash2, Loader2, X, AlertCircle } from "lucide-react";
import type { TeamMember } from "@/types/database";

export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    designation: "",
    qualification: "",
    bio: "",
    image_url: "" as string | null,
    image_public_id: "" as string | null,
    display_order: 0,
    is_active: true,
  });

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/crud?table=team_members", {
        cache: "no-store",
      });
      const json = await res.json();
      setTeam(json.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const openAddModal = () => {
    setEditingMember(null);
    setForm({
      name: "",
      designation: "",
      qualification: "",
      bio: "",
      image_url: null,
      image_public_id: null,
      display_order: team.length + 1,
      is_active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (member: TeamMember) => {
    setEditingMember(member);
    setForm({
      name: member.name,
      designation: member.designation,
      qualification: member.qualification || "",
      bio: member.bio || "",
      image_url: member.image_url,
      image_public_id: member.image_public_id,
      display_order: member.display_order,
      is_active: member.is_active,
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
          table: "team_members",
          id: editingMember?.id,
          item: form,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to save team member");
      }

      setModalOpen(false);
      fetchTeam();
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || "Failed to save team member");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;
    try {
      const res = await fetch(`/api/admin/crud?table=team_members&id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Failed to delete");
      fetchTeam();
    } catch (err: unknown) {
      const e = err as Error;
      alert(e.message || "Failed to delete");
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-black/10 gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-black/50 mb-1">
            Section 03
          </div>
          <h1 className="text-3xl font-serif text-[#121418] font-normal tracking-tight">
            Engineering Team &amp; Leadership
          </h1>
          <p className="text-xs text-black/60 font-mono mt-1">
            Manage executive leadership profiles and portrait photographs
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#121418] hover:bg-black text-white text-xs font-mono uppercase tracking-[0.2em] font-bold transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Grid of Team Cards */}
      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-black/40" />
        </div>
      ) : team.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member) => (
            <div
              key={member.id}
              className="bg-white border border-black/10 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/5] w-full bg-[#121418] overflow-hidden">
                  {member.image_url ? (
                    <Image
                      src={member.image_url}
                      alt={member.name}
                      fill
                      sizes="350px"
                      className="object-cover object-top transition-all duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/30 font-mono text-xs">
                      No Photo
                    </div>
                  )}
                  <span
                    className={`absolute top-3 right-3 px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider ${
                      member.is_active
                        ? "bg-emerald-500/90 text-white"
                        : "bg-black/60 text-white/60"
                    }`}
                  >
                    {member.is_active ? "Active" : "Hidden"}
                  </span>
                </div>

                <div className="p-5 space-y-1.5">
                  <h3 className="text-base font-serif font-bold text-[#121418]">
                    {member.name}
                  </h3>
                  <div className="text-xs font-mono uppercase tracking-wider text-black/60">
                    {member.designation}
                  </div>
                  {member.qualification && (
                    <div className="text-[11px] font-mono text-black/40">
                      {member.qualification}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-black/10 flex items-center justify-between text-xs font-mono text-black/50 bg-black/[0.01]">
                <span>Order: {member.display_order}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(member)}
                    className="p-1.5 hover:bg-black/10 text-black/70 hover:text-black"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="p-1.5 hover:bg-red-50 text-red-500 hover:text-red-700"
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
            No team members added yet.
          </p>
          <p className="text-xs font-mono text-black/40">
            Click &quot;Add Member&quot; to upload team member portraits and qualifications.
          </p>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-black/15 max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-black/10 pb-4">
              <h2 className="text-lg font-serif text-[#121418]">
                {editingMember ? "Edit Team Member" : "Add Team Member"}
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
                  label="Portrait Photography (Cloudinary)"
                  currentImageUrl={form.image_url}
                  currentPublicId={form.image_public_id}
                  folder="maple-consulting/team"
                  aspectRatio="aspect-[4/5]"
                  onUploadSuccess={({ url, public_id }) => {
                    setForm((prev) => ({
                      ...prev,
                      image_url: url,
                      image_public_id: public_id,
                    }));
                  }}
                  onRemove={() => {
                    setForm((prev) => ({
                      ...prev,
                      image_url: null,
                      image_public_id: null,
                    }));
                  }}
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-black/70 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Muhammed Shameer V.P."
                  className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs font-serif text-base"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-black/70 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    required
                    value={form.designation}
                    onChange={(e) => setForm({ ...form, designation: e.target.value })}
                    placeholder="e.g. Co-Founder"
                    className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs"
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

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-black/70 mb-1">
                  Qualifications &amp; Degrees
                </label>
                <input
                  type="text"
                  value={form.qualification}
                  onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                  placeholder="e.g. M-Tech in Structural Engineering"
                  className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-black/70 mb-1">
                  Bio / Background
                </label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Professional background, expertise, and achievements..."
                  className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="team_is_active"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="team_is_active" className="text-xs font-mono text-black/80">
                  Visible on Homepage (Active)
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
                  {saving ? "Saving..." : "Save Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
