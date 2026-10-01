import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Accordion, type AccordionItem } from "@/components/ui/Accordion";
import type { HomepageContent, Service } from "@/types/database";

interface ServicesSectionProps {
  content?: HomepageContent | null;
  services?: Service[];
}

export function ServicesSection({ content, services = [] }: ServicesSectionProps) {
  const sectionNumber = content?.services_section_number || "02";
  const eyebrow = content?.services_eyebrow || "SERVICES";
  const title = content?.services_title || "What we do.";
  const tagline =
    content?.services_tagline || "IDEAS STRUCTURES EXECUTING FOR A BETTER TOMORROW";
  const primaryImageUrl = content?.services_image_url;
  const secondaryImageUrl = content?.services_secondary_image_url;

  // Convert database services into AccordionItems
  const accordionItems: AccordionItem[] = services.map((s, index) => ({
    id: s.id,
    number: s.number_label || String(index + 1).padStart(2, "0"),
    title: s.title,
    content: s.description || s.short_description || "Detailed consultation and structural engineering services tailored to project specifications.",
  }));

  return (
    <section id="services" className="py-24 sm:py-32 bg-[#f7f6f2] text-[#121418] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 pb-6 border-b border-black/10 gap-4">
          <div>
            <SectionLabel number={sectionNumber} label={eyebrow} theme="light" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#121418] font-normal tracking-tight mt-3">
              {title}
            </h2>
          </div>
          <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-black/50 sm:text-right max-w-xs leading-relaxed">
            {tagline}
          </div>
        </div>

        {/* 3-Column Architectural Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Column 1: Primary Architectural Column Image (~3.5 cols) */}
          <div className="hidden lg:block lg:col-span-3 space-y-4">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#e0ded8] shadow-sm">
              {primaryImageUrl ? (
                <Image
                  src={primaryImageUrl}
                  alt="Architectural structure"
                  fill
                  sizes="(max-width: 1200px) 25vw, 300px"
                  className="object-cover object-center grayscale-[0.2] contrast-[1.05]"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-b from-[#dcd9d1] to-[#c7c4bb] flex flex-col justify-end p-6">
                  <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-black/40">
                    Structural Analysis
                  </span>
                </div>
              )}
            </div>
            <div className="text-[9px] font-mono tracking-[0.25em] uppercase text-black/45 leading-relaxed">
              {tagline}
            </div>
          </div>

          {/* Column 2: Accordion List (Center, ~6 cols) */}
          <div className="lg:col-span-6">
            {services.length > 0 ? (
              <Accordion items={accordionItems} defaultOpenIndex={0} />
            ) : (
              /* Graceful empty state when no services are added yet */
              <div className="py-16 px-8 border border-dashed border-black/20 text-center space-y-3 bg-black/[0.02]">
                <p className="font-serif text-lg text-black/70 italic">
                  Services are currently being updated.
                </p>
                <p className="text-xs font-mono tracking-wider text-black/40">
                  Please check back shortly or contact our engineering team directly.
                </p>
              </div>
            )}
          </div>

          {/* Column 3: Secondary Perspective Image (~2.5 cols) */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#dedcd5] shadow-sm">
              {secondaryImageUrl ? (
                <Image
                  src={secondaryImageUrl}
                  alt="Engineering consultancy project facade"
                  fill
                  sizes="(max-width: 1200px) 20vw, 260px"
                  className="object-cover object-center grayscale-[0.15] contrast-[1.05]"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-t from-[#cfccc4] to-[#dedbd3] flex items-center justify-center p-6 text-center">
                  <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-black/40">
                    High-Rise &amp; Infrastructure
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
