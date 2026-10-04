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

  // Ensure there are enough items to comfortably span across any screen width before looping
  const repeatedList =
    clients.length < 10
      ? Array.from({ length: Math.ceil(10 / clients.length) }, () => clients).flat()
      : clients;

  // Duplicate the list once so the second half seamlessly replaces the first at -50% translateX
  const marqueeItems = [...repeatedList, ...repeatedList];

  // Dynamic pacing: ~2.2s per card creates a relaxed, premium architectural tempo (~110px/s)
  const duration = Math.max(25, repeatedList.length * 2.2);

  return (
    <section id="clients" className="py-20 sm:py-28 bg-[#f7f6f2] text-[#121418] border-b border-black/10 overflow-hidden">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 mb-10 sm:mb-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
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
      </div>

      {/* Straight Full-Width Horizontal Auto-Scrolling Ribbon */}
      <div className="relative w-full border-y border-black/10 bg-[#f7f6f2] py-2 overflow-hidden">
        {/* Left Edge Gradient Fade */}
        <div
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 sm:w-36 z-10 bg-gradient-to-r from-[#f7f6f2] via-[#f7f6f2]/80 to-transparent"
          aria-hidden="true"
        />

        {/* Marquee Track */}
        <div
          className="animate-marquee flex items-center"
          style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
        >
          {marqueeItems.map((client, index) => {
            const cardContent = (
              <div className="w-52 sm:w-64 shrink-0 h-32 sm:h-36 px-6 sm:px-8 flex flex-col items-center justify-center text-center border-r border-black/10 group transition-colors hover:bg-black/[0.02]">
                <div className="relative h-12 sm:h-14 w-28 sm:w-36 mb-2.5 flex items-center justify-center">
                  {client.logo_url ? (
                    <Image
                      src={client.logo_url}
                      alt={client.name}
                      fill
                      sizes="(max-width: 640px) 120px, 160px"
                      className="object-contain opacity-100 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="font-mono text-xs uppercase tracking-wider text-black/50">
                      {client.name}
                    </span>
                  )}
                </div>
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-black/60 group-hover:text-black transition-colors line-clamp-1">
                  {client.name}
                </span>
              </div>
            );

            if (client.website_url) {
              return (
                <a
                  key={`${client.id}-${index}`}
                  href={client.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block shrink-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-black"
                  title={client.name}
                >
                  {cardContent}
                </a>
              );
            }

            return (
              <div key={`${client.id}-${index}`} className="shrink-0">
                {cardContent}
              </div>
            );
          })}
        </div>

        {/* Right Edge Gradient Fade */}
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 sm:w-36 z-10 bg-gradient-to-l from-[#f7f6f2] via-[#f7f6f2]/80 to-transparent"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}

