"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import type { HomepageContent } from "@/types/database";

export default function AdminHomepageEditor() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<Partial<HomepageContent>>({
    hero_eyebrow: "ENGINEERING\nPEOPLE\nPLACES\nBETTER TOMORROW",
    hero_title_line1: "delivering",
    hero_title_line2: "EXCELLENCE",
    hero_description:
      "Every project is an opportunity to build upon our reputation for quality, creativity, and strong relationships.",
    hero_cta_label: "DISCOVER MAPLE",
    hero_cta_url: "#about",
    hero_vertical_text: "CIVIL & STRUCTURAL ENGINEERING",
    hero_image_url: null,
    hero_image_public_id: null,
    hero_image_2_url: null,
    hero_image_2_public_id: null,
    hero_image_3_url: null,
    hero_image_3_public_id: null,

    about_section_number: "01",
    about_eyebrow: "ABOUT US",
    about_title: "Built on experience.\nDriven by possibility.",
    about_description_1:
      "Maple consulting engineers are a Civil and Structural Engineering consultancy offering a nationwide service to our clients. Our experience and expertise allow us to offer a range of specialist services, all integrated to serve the needs and requirements of clients in the sectors in which we operate. We provide innovative structural design and analysis services to architects, owners, and developers for all types of buildings at all project phases.",
    about_description_2:
      "Maple consulting engineers undertakes a wide variety of work, ranging from major new build schemes through to complex renovation projects across the market sectors in which we operate. We are involved in consulting projects across both the public and private sectors.",
    about_cta_label: "MORE ABOUT US",
    about_cta_url: "/about",
    about_image_url: null,
    about_image_public_id: null,

    vision_eyebrow: "OUR VISION",
    vision_title: "Shaping A\nBetter World",
    vision_image_url: null,
    vision_image_public_id: null,
    purpose_eyebrow: "OUR PURPOSE",
    purpose_title_line1: "NURTURING",
    purpose_title_line2: "GROWTH",
    purpose_tagline: "PEOPLE STRUCTURED COMMUNITIES A RENOWNED TOMORROW",

    services_section_number: "02",
    services_eyebrow: "SERVICES",
    services_title: "What we do.",
    services_tagline: "IDEAS STRUCTURES EXECUTING FOR A BETTER TOMORROW",
    services_image_url: null,
    services_image_public_id: null,
    services_secondary_image_url: null,
    services_secondary_image_public_id: null,

    team_section_number: "03",
    team_eyebrow: "TEAM",
    team_title: "Our people\nare our company.",
    team_quote: "Expertise becomes meaningful when it is shared.",
    team_cta_label: "MEET OUR TEAM",
    team_cta_url: "/team",

    clients_section_number: "04",
    clients_eyebrow: "CLIENTS",
    clients_title: "Our clients are our growth.",
    clients_tagline: "TRUSTED COLLABORATIONS\nLONG TERM RELATIONSHIPS",

    projects_section_number: "05",
    projects_eyebrow: "PROJECTS",
    projects_title: "Every Project is Unique",
    projects_description:
      "We approach every design challenge with a passion for solving problems. Our goal is to provide good quality works and services in everything we do.",
    projects_cta_label: "VIEW ALL PROJECTS",
    projects_cta_url: "/projects",

    contact_section_number: "06",
    contact_eyebrow: "CONTACT",
    contact_title: "We are looking\nforward to the future.",
    contact_highlight_text: "Wherever!\nWhenever!\nTogether with you.",
    contact_image_url: null,
    contact_image_public_id: null,
  });

  useEffect(() => {
    async function loadData() {
      try {
        // Try content API first with cache: no-store
        const res = await fetch("/api/admin/content?section=homepage_content", {
          cache: "no-store",
        });
        const json = await res.json();
        if (json.homepage_content) {
          setForm(json.homepage_content);
        } else {
          const { data, error } = await supabase
            .from("homepage_content")
            .select("*")
            .limit(1)
            .maybeSingle();

          if (!error && data) {
            setForm(data);
          }
        }
      } catch (err) {
        console.error("Error loading homepage data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [supabase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "homepage_content", payload: form }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to save homepage content");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || "Failed to save homepage changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-black/50" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-12">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-black/10 gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-black/50 mb-1">
            Visual Composition
          </div>
          <h1 className="text-3xl font-serif text-[#121418] font-normal tracking-tight">
            Homepage Content &amp; Media Editor
          </h1>
          <p className="text-xs text-black/60 font-mono mt-1">
            Customise editorial headlines, statements, and Cloudinary photographic assets
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#121418] hover:bg-black text-white text-xs font-mono uppercase tracking-[0.2em] font-bold transition-colors disabled:opacity-50 self-start sm:self-auto"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Notifications */}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Homepage content updated successfully! Public site will reflect changes.</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-300 text-red-800 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* SECTION 1: HERO */}
      <div className="bg-white border border-black/10 p-6 sm:p-8 space-y-6">
        <div className="border-b border-black/10 pb-3 flex items-center justify-between">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] font-semibold text-[#121418]">
            01. Hero Section
          </h2>
          <span className="text-[10px] font-mono text-black/40 uppercase">Above the fold</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-black/70 mb-1">
                Eyebrow (Vertical list / Lines)
              </label>
              <textarea
                rows={3}
                value={form.hero_eyebrow || ""}
                onChange={(e) => setForm({ ...form, hero_eyebrow: e.target.value })}
                className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs font-mono focus:outline-none focus:border-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-black/70 mb-1">
                  Title Line 1 (Serif)
                </label>
                <input
                  type="text"
                  value={form.hero_title_line1 || ""}
                  onChange={(e) => setForm({ ...form, hero_title_line1: e.target.value })}
                  className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs focus:outline-none focus:border-black font-serif italic text-base"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-black/70 mb-1">
                  Title Line 2 (Bold Sans)
                </label>
                <input
                  type="text"
                  value={form.hero_title_line2 || ""}
                  onChange={(e) => setForm({ ...form, hero_title_line2: e.target.value })}
                  className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs focus:outline-none focus:border-black font-sans font-black uppercase text-base"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-black/70 mb-1">
                Supporting Description
              </label>
              <textarea
                rows={3}
                value={form.hero_description || ""}
                onChange={(e) => setForm({ ...form, hero_description: e.target.value })}
                className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs focus:outline-none focus:border-black leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-black/70 mb-1">
                  CTA Label
                </label>
                <input
                  type="text"
                  value={form.hero_cta_label || ""}
                  onChange={(e) => setForm({ ...form, hero_cta_label: e.target.value })}
                  className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs focus:outline-none focus:border-black font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-black/70 mb-1">
                  CTA URL
                </label>
                <input
                  type="text"
                  value={form.hero_cta_url || ""}
                  onChange={(e) => setForm({ ...form, hero_cta_url: e.target.value })}
                  className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs focus:outline-none focus:border-black font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-black/70 mb-1">
                Left Vertical Watermark Text
              </label>
              <input
                type="text"
                value={form.hero_vertical_text || ""}
                onChange={(e) => setForm({ ...form, hero_vertical_text: e.target.value })}
                className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs focus:outline-none focus:border-black font-mono uppercase"
              />
            </div>
          </div>
        </div>

        {/* 3 HERO BANNER SLOTS (AUTO-SLIDESHOW) */}
        <div className="pt-6 border-t border-black/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] font-semibold text-[#121418]">
                Hero Banners (3 Slots — Auto-Slideshow)
              </h3>
              <p className="text-[11px] font-mono text-black/60 mt-0.5">
                Upload up to 3 banner images. When 2 or 3 are added, the hero automatically cycles with cross-fade transitions.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/5 text-[10px] font-mono uppercase tracking-wider text-black/70 border border-black/10 self-start">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Auto-Slide Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Slot 1: Primary Banner */}
            <div className="space-y-2 p-3 bg-black/[0.015] border border-black/10">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#121418]">
                  01. Primary Banner
                </span>
                <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200">
                  Slide 1
                </span>
              </div>
              <ImageUploader
                label="Banner Slide 1"
                currentImageUrl={form.hero_image_url}
                currentPublicId={form.hero_image_public_id}
                folder="maple-consulting/hero"
                aspectRatio="aspect-[16/10]"
                onUploadSuccess={({ url, public_id }) => {
                  setForm((prev) => ({
                    ...prev,
                    hero_image_url: url,
                    hero_image_public_id: public_id,
                  }));
                }}
                onRemove={() => {
                  setForm((prev) => ({
                    ...prev,
                    hero_image_url: null,
                    hero_image_public_id: null,
                  }));
                }}
              />
            </div>

            {/* Slot 2: Secondary Banner */}
            <div className="space-y-2 p-3 bg-black/[0.015] border border-black/10">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#121418]">
                  02. Second Banner
                </span>
                <span className="text-[9px] font-mono text-black/60 bg-black/5 px-1.5 py-0.5 border border-black/10">
                  Slide 2
                </span>
              </div>
              <ImageUploader
                label="Banner Slide 2"
                currentImageUrl={form.hero_image_2_url}
                currentPublicId={form.hero_image_2_public_id}
                folder="maple-consulting/hero"
                aspectRatio="aspect-[16/10]"
                onUploadSuccess={({ url, public_id }) => {
                  setForm((prev) => ({
                    ...prev,
                    hero_image_2_url: url,
                    hero_image_2_public_id: public_id,
                  }));
                }}
                onRemove={() => {
                  setForm((prev) => ({
                    ...prev,
                    hero_image_2_url: null,
                    hero_image_2_public_id: null,
                  }));
                }}
              />
            </div>

            {/* Slot 3: Tertiary Banner */}
            <div className="space-y-2 p-3 bg-black/[0.015] border border-black/10">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#121418]">
                  03. Third Banner
                </span>
                <span className="text-[9px] font-mono text-black/60 bg-black/5 px-1.5 py-0.5 border border-black/10">
                  Slide 3
                </span>
              </div>
              <ImageUploader
                label="Banner Slide 3"
                currentImageUrl={form.hero_image_3_url}
                currentPublicId={form.hero_image_3_public_id}
                folder="maple-consulting/hero"
                aspectRatio="aspect-[16/10]"
                onUploadSuccess={({ url, public_id }) => {
                  setForm((prev) => ({
                    ...prev,
                    hero_image_3_url: url,
                    hero_image_3_public_id: public_id,
                  }));
                }}
                onRemove={() => {
                  setForm((prev) => ({
                    ...prev,
                    hero_image_3_url: null,
                    hero_image_3_public_id: null,
                  }));
                }}
              />
            </div>
          </div>
        </div>
      </div>


      {/* SECTION 2: ABOUT */}
      <div className="bg-white border border-black/10 p-6 sm:p-8 space-y-6">
        <div className="border-b border-black/10 pb-3 flex items-center justify-between">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] font-semibold text-[#121418]">
            02. About Section
          </h2>
          <span className="text-[10px] font-mono text-black/40 uppercase">Experience &amp; Vision</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-black/70 mb-1">
                  Section Number
                </label>
                <input
                  type="text"
                  value={form.about_section_number || ""}
                  onChange={(e) => setForm({ ...form, about_section_number: e.target.value })}
                  className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-black/70 mb-1">
                  Eyebrow Label
                </label>
                <input
                  type="text"
                  value={form.about_eyebrow || ""}
                  onChange={(e) => setForm({ ...form, about_eyebrow: e.target.value })}
                  className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs font-mono uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-black/70 mb-1">
                Headline
              </label>
              <textarea
                rows={2}
                value={form.about_title || ""}
                onChange={(e) => setForm({ ...form, about_title: e.target.value })}
                className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs font-serif text-lg leading-snug"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-black/70 mb-1">
                Primary Description
              </label>
              <textarea
                rows={4}
                value={form.about_description_1 || ""}
                onChange={(e) => setForm({ ...form, about_description_1: e.target.value })}
                className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-black/70 mb-1">
                Secondary Description
              </label>
              <textarea
                rows={3}
                value={form.about_description_2 || ""}
                onChange={(e) => setForm({ ...form, about_description_2: e.target.value })}
                className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs leading-relaxed"
              />
            </div>
          </div>

          <div>
            <ImageUploader
              label="About Architectural / Engineering Drafting Image"
              currentImageUrl={form.about_image_url}
              currentPublicId={form.about_image_public_id}
              folder="maple-consulting/about"
              aspectRatio="aspect-[4/3]"
              onUploadSuccess={({ url, public_id }) => {
                setForm((prev) => ({
                  ...prev,
                  about_image_url: url,
                  about_image_public_id: public_id,
                }));
              }}
              onRemove={() => {
                setForm((prev) => ({
                  ...prev,
                  about_image_url: null,
                  about_image_public_id: null,
                }));
              }}
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: VISION & PURPOSE */}
      <div className="bg-white border border-black/10 p-6 sm:p-8 space-y-6">
        <div className="border-b border-black/10 pb-3 flex items-center justify-between">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] font-semibold text-[#121418]">
            03. Vision &amp; Purpose Split Section
          </h2>
          <span className="text-[10px] font-mono text-black/40 uppercase">Full width statement</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase text-black/40 font-semibold">Left (Vision)</h3>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-black/70 mb-1">
                Vision Headline
              </label>
              <textarea
                rows={2}
                value={form.vision_title || ""}
                onChange={(e) => setForm({ ...form, vision_title: e.target.value })}
                className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs font-serif text-lg"
              />
            </div>

            <ImageUploader
              label="Vision Landscape / Viaduct Image"
              currentImageUrl={form.vision_image_url}
              currentPublicId={form.vision_image_public_id}
              folder="maple-consulting/vision"
              aspectRatio="aspect-[16/10]"
              onUploadSuccess={({ url, public_id }) => {
                setForm((prev) => ({
                  ...prev,
                  vision_image_url: url,
                  vision_image_public_id: public_id,
                }));
              }}
              onRemove={() => {
                setForm((prev) => ({
                  ...prev,
                  vision_image_url: null,
                  vision_image_public_id: null,
                }));
              }}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase text-black/40 font-semibold">Right (Purpose)</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-black/70 mb-1">
                  Purpose Word 1 (Serif)
                </label>
                <input
                  type="text"
                  value={form.purpose_title_line1 || ""}
                  onChange={(e) => setForm({ ...form, purpose_title_line1: e.target.value })}
                  className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs font-serif italic text-base"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-black/70 mb-1">
                  Purpose Word 2 (Sans)
                </label>
                <input
                  type="text"
                  value={form.purpose_title_line2 || ""}
                  onChange={(e) => setForm({ ...form, purpose_title_line2: e.target.value })}
                  className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs font-sans font-bold uppercase text-base"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-black/70 mb-1">
                Bottom Tagline
              </label>
              <textarea
                rows={2}
                value={form.purpose_tagline || ""}
                onChange={(e) => setForm({ ...form, purpose_tagline: e.target.value })}
                className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs font-mono uppercase"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: SERVICES SECTION MEDIA */}
      <div className="bg-white border border-black/10 p-6 sm:p-8 space-y-6">
        <div className="border-b border-black/10 pb-3 flex items-center justify-between">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] font-semibold text-[#121418]">
            04. Services Section Framing &amp; Images
          </h2>
          <span className="text-[10px] font-mono text-black/40 uppercase">What We Do Section</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-black/70 mb-1">
                Section Title
              </label>
              <input
                type="text"
                value={form.services_title || ""}
                onChange={(e) => setForm({ ...form, services_title: e.target.value })}
                className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs font-serif text-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-black/70 mb-1">
                Tagline
              </label>
              <textarea
                rows={2}
                value={form.services_tagline || ""}
                onChange={(e) => setForm({ ...form, services_tagline: e.target.value })}
                className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs font-mono uppercase"
              />
            </div>
          </div>

          <div>
            <ImageUploader
              label="Left Architectural Colonnade Image"
              currentImageUrl={form.services_image_url}
              currentPublicId={form.services_image_public_id}
              folder="maple-consulting/services"
              aspectRatio="aspect-[3/4]"
              onUploadSuccess={({ url, public_id }) => {
                setForm((prev) => ({
                  ...prev,
                  services_image_url: url,
                  services_image_public_id: public_id,
                }));
              }}
              onRemove={() => {
                setForm((prev) => ({
                  ...prev,
                  services_image_url: null,
                  services_image_public_id: null,
                }));
              }}
            />
          </div>

          <div>
            <ImageUploader
              label="Right Facade Perspective Image"
              currentImageUrl={form.services_secondary_image_url}
              currentPublicId={form.services_secondary_image_public_id}
              folder="maple-consulting/services"
              aspectRatio="aspect-[2/3]"
              onUploadSuccess={({ url, public_id }) => {
                setForm((prev) => ({
                  ...prev,
                  services_secondary_image_url: url,
                  services_secondary_image_public_id: public_id,
                }));
              }}
              onRemove={() => {
                setForm((prev) => ({
                  ...prev,
                  services_secondary_image_url: null,
                  services_secondary_image_public_id: null,
                }));
              }}
            />
          </div>
        </div>
      </div>

      {/* Save Button bottom */}
      <div className="pt-6 border-t border-black/10 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#121418] hover:bg-black text-white text-xs font-mono uppercase tracking-[0.2em] font-bold transition-colors disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save All Homepage Content</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
