import React from "react";
import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { HomepageContent, Client } from "@/types/database";

interface ClientsSectionProps {
  content?: HomepageContent | null;
  clients?: Client[];
}

export function ClientsSection({ content, clients = [] }: ClientsSectionProps) {
  // If there are zero clients, we can choose to hide or show clean neutral state
  const sectionNumber = content?.clients_section_number || "04";
  const eyebrow = content?.clients_eyebrow || "CLIENTS";
  const title = content?.clients_title || "Our clients are our growth.";
  const tagline =
    content?.clients_tagline || "TRUSTED COLLABORATIONS\nLONG TERM RELATIONSHIPS";

  if (!clients || clients.length === 0) {
    // Hidden gracefully or neutral empty state
    return null;
  }

  return (
    <section id="clients" className="py-20 sm:py-28 bg-[#f7f6f2] text-[#121418] border-b border-black/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-4">
          <div>
            <SectionLabel number={sectionNumber} label={eyebrow} theme="light" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#121418] font-normal tracking-tight mt-3">
              {title}
            </h2>
          </div>
          <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-black/50 sm:text-right leading-relaxed whitespace-pre-line">
            {tagline}
          </div>
        </div>

        {/* 6-Column Grid of Logos with Fine Dividers */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 divide-x divide-black/10 border-y border-black/10">
          {clients.map((client) => (
            <div
              key={client.id}
              className="py-10 px-6 flex flex-col items-center justify-center text-center group transition-colors hover:bg-black/[0.02]"
            >
              <div className="relative h-12 w-28 mb-3 flex items-center justify-center">
                {client.logo_url ? (
                  <Image
                    src={client.logo_url}
                    alt={client.name}
                    fill
                    sizes="120px"
                    className="object-contain grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300"
                  />
                ) : (
                  <span className="font-mono text-xs text-black/40">{client.name}</span>
                )}
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-black/40 group-hover:text-black/80 transition-colors">
                {client.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
