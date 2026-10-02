"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import type { SiteSettings } from "@/types/database";

export default function AdminSettingsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<Partial<SiteSettings>>({
    company_name: "Maple Consulting Engineers",
    tagline: "Civil & Structural Engineering Consultancy",
    logo_url: null,
    logo_public_id: null,
    favicon_url: null,
    email: "maplececlt@gmail.com",
    phone: "+91 8281 33 44 35",
    phone_alt: "+91 9946 62 50 63",
    whatsapp: "+91 8281 33 44 35",
    address: "Near Popular Vehicle Showroom, Meleparamba, Calicut",
    google_maps_url: "",
    copyright_text: "© 2026 Maple Consulting Engineers. All rights reserved.",
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/content?section=site_settings", {
          cache: "no-store",
        });
        const json = await res.json();
        if (json.site_settings) {
          setForm(json.site_settings);
        } else {
          const { data, error } = await supabase
            .from("site_settings")
            .select("*")
            .limit(1)
            .maybeSingle();

          if (!error && data) {
            setForm(data);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
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
        body: JSON.stringify({ section: "site_settings", payload: form }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to save settings");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-black/40" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-black/10 gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-black/50 mb-1">
            Global Configuration
          </div>
          <h1 className="text-3xl font-serif text-[#121418] font-normal tracking-tight">
            Site Settings &amp; Contact Info
          </h1>
          <p className="text-xs text-black/60 font-mono mt-1">
            Company information, contact coordinates, logo, and copyright
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#121418] hover:bg-black text-white text-xs font-mono uppercase tracking-[0.2em] font-bold transition-colors disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </>
          )}
        </button>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Site settings successfully updated!</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-300 text-red-800 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Company Identity */}
        <div className="bg-white border border-black/10 p-6 sm:p-8 space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-[0.2em] font-semibold text-[#121418] pb-2 border-b border-black/10">
            Brand Identity
          </h2>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-black/70 mb-1">
              Company Name
            </label>
            <input
              type="text"
              required
              value={form.company_name || ""}
              onChange={(e) => setForm({ ...form, company_name: e.target.value })}
              className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs font-serif text-base"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-black/70 mb-1">
              Tagline / Subtitle
            </label>
            <textarea
              rows={2}
              value={form.tagline || ""}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs"
            />
          </div>

          <div>
            <ImageUploader
              label="Custom Brand Logo"
              currentImageUrl={form.logo_url}
              currentPublicId={form.logo_public_id}
              folder="maple-consulting/logo"
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
            <p className="text-[10px] text-black/40 mt-1 font-mono">
              Note: If left empty, the site automatically renders the high-precision vector Maple mark.
            </p>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-black/70 mb-1">
              Footer Copyright Text
            </label>
            <input
              type="text"
              value={form.copyright_text || ""}
              onChange={(e) => setForm({ ...form, copyright_text: e.target.value })}
              className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs font-mono"
            />
          </div>
        </div>

        {/* Contact Coordinates */}
        <div className="bg-white border border-black/10 p-6 sm:p-8 space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-[0.2em] font-semibold text-[#121418] pb-2 border-b border-black/10">
            Contact Coordinates
          </h2>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-black/70 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={form.email || ""}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-black/70 mb-1">
                Primary Phone
              </label>
              <input
                type="text"
                value={form.phone || ""}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-black/70 mb-1">
                Alternate Phone
              </label>
              <input
                type="text"
                value={form.phone_alt || ""}
                onChange={(e) => setForm({ ...form, phone_alt: e.target.value })}
                className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-black/70 mb-1">
              WhatsApp Number
            </label>
            <input
              type="text"
              value={form.whatsapp || ""}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-black/70 mb-1">
              Headquarters / Office Address
            </label>
            <textarea
              rows={3}
              value={form.address || ""}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-black/70 mb-1">
              Google Maps Embed / Link
            </label>
            <input
              type="url"
              value={form.google_maps_url || ""}
              onChange={(e) => setForm({ ...form, google_maps_url: e.target.value })}
              placeholder="https://maps.google.com/..."
              className="w-full p-2.5 bg-black/[0.02] border border-black/15 text-xs font-mono"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
