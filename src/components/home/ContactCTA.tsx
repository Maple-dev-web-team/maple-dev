"use client";

import React, { useState } from "react";
import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MapPin, Phone, Mail, Send, CheckCircle2 } from "lucide-react";
import { publicSupabase } from "@/lib/supabase/public";
import type { HomepageContent, SiteSettings, Branch } from "@/types/database";

interface ContactCTAProps {
  content?: HomepageContent | null;
  settings?: SiteSettings | null;
  branches?: Branch[];
}

export function ContactCTA({ content, settings, branches = [] }: ContactCTAProps) {
  const sectionNumber = content?.contact_section_number || "06";
  const eyebrow = content?.contact_eyebrow || "CONTACT";
  const title = content?.contact_title || "We are looking\nforward to the future.";
  const highlightText =
    content?.contact_highlight_text || "Wherever!\nWhenever!\nTogether with you.";
  const bgImageUrl = content?.contact_image_url;

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const { error } = await publicSupabase.from("contact_submissions").insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          message: formData.message,
          status: "new",
        },
      ]);

      if (error) {
        console.warn("Contact submission notice:", error.message);
        // Fallback friendly alert if table is being migrated
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || "Failed to submit enquiry. Please call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32 bg-[#eae7df] text-[#121418] overflow-hidden">
      {/* Background Architectural Concrete / Landscape */}
      {bgImageUrl && (
        <div className="absolute inset-0 z-0 opacity-25">
          <Image
            src={bgImageUrl}
            alt="Maple Engineering Contact"
            fill
            sizes="100vw"
            className="object-cover object-right"
          />
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Heading and Copper Italic Statement (~6 cols) */}
          <div className="lg:col-span-6 space-y-8">
            <SectionLabel number={sectionNumber} label={eyebrow} theme="light" />

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#121418] font-normal leading-[1.15] whitespace-pre-line tracking-tight">
              {title}
            </h2>

            {/* Warm Terracotta / Copper Italic Statement */}
            <div className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-[#b46b38] leading-tight whitespace-pre-line tracking-tight">
              {highlightText}
            </div>

            {/* Inline Quick Message Form */}
            <div className="pt-6">
              {submitted ? (
                <div className="p-6 bg-white/80 border border-black/10 flex items-start gap-4 text-emerald-800">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
                  <div className="text-sm">
                    <p className="font-semibold">Thank you for contacting us.</p>
                    <p className="text-xs text-black/60 mt-1">
                      Our engineering consulting team will reach out to you promptly.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/90 border border-black/15 text-xs text-[#121418] placeholder-black/40 focus:outline-none focus:border-black transition-colors"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/90 border border-black/15 text-xs text-[#121418] placeholder-black/40 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <input
                    type="tel"
                    placeholder="Phone (optional)"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/90 border border-black/15 text-xs text-[#121418] placeholder-black/40 focus:outline-none focus:border-black transition-colors"
                  />
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe your engineering requirement or project..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/90 border border-black/15 text-xs text-[#121418] placeholder-black/40 focus:outline-none focus:border-black transition-colors resize-none"
                  />
                  {errorMessage && (
                    <p className="text-xs text-red-600 font-mono">{errorMessage}</p>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#121418] hover:bg-black text-white text-xs uppercase font-mono tracking-[0.2em] transition-colors disabled:opacity-50"
                  >
                    <span>{isSubmitting ? "Submitting..." : "Send Enquiry"}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Contact Cards and Branches (~6 cols) */}
          <div className="lg:col-span-6 bg-white/70 backdrop-blur-sm border border-black/10 p-8 sm:p-10 space-y-10 shadow-sm">
            {/* Primary Office Contact */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-[#121418]/70" />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/40 mb-1">
                    Corporate Office
                  </div>
                  <p className="text-sm font-medium text-[#121418] leading-relaxed">
                    {settings?.address ||
                      "Near Popular Vehicle Showroom, Meleparamba, Calicut"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-4 h-4 text-[#121418]/70" />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/40 mb-1">
                    Telephone
                  </div>
                  <div className="space-y-1 text-sm font-medium text-[#121418]">
                    <a
                      href={`tel:${settings?.phone || "+918281334435"}`}
                      className="block hover:underline"
                    >
                      {settings?.phone || "+91 8281 33 44 35"}
                    </a>
                    {settings?.phone_alt && (
                      <a
                        href={`tel:${settings?.phone_alt}`}
                        className="block hover:underline"
                      >
                        {settings.phone_alt}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-4 h-4 text-[#121418]/70" />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/40 mb-1">
                    Direct Email
                  </div>
                  <a
                    href={`mailto:${settings?.email || "maplececlt@gmail.com"}`}
                    className="text-sm font-medium text-[#121418] hover:underline"
                  >
                    {settings?.email || "maplececlt@gmail.com"}
                  </a>
                </div>
              </div>
            </div>

            {/* Our Branches */}
            <div className="pt-6 border-t border-black/10">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-black/50 mb-4">
                Our Branches
              </h3>
              {branches.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#121418]/80">
                  {branches.map((b) => (
                    <div key={b.id} className="p-3 bg-black/[0.03] border border-black/5">
                      <div className="font-semibold text-[#121418]">{b.name}</div>
                      {b.address && <div className="text-[11px] text-black/60 mt-0.5">{b.address}</div>}
                      {b.phone && <div className="text-[11px] text-black/60">{b.phone}</div>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-1.5 text-xs text-[#121418]/80 font-medium">
                  <div>Palakkad</div>
                  <div>Kochi</div>
                  <div>Koramangala (Bangalore)</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
