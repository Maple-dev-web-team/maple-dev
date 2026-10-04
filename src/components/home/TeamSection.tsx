"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Plus } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { HomepageContent, TeamMember } from "@/types/database";

interface TeamSectionProps {
  content?: HomepageContent | null;
  team?: TeamMember[];
}

export function TeamSection({ content, team = [] }: TeamSectionProps) {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const toggleMember = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const children = container.children;
    if (children[index]) {
      (children[index] as HTMLElement).scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
      setActiveMobileIndex(index);
    }
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const firstCard = container.firstElementChild as HTMLElement | null;
    const cardWidth = firstCard ? firstCard.offsetWidth + 16 : 260;
    const newIndex = Math.round(scrollLeft / cardWidth);
    if (newIndex >= 0 && newIndex < team.length && newIndex !== activeMobileIndex) {
      setActiveMobileIndex(newIndex);
    }
  };

  const sectionNumber = content?.team_section_number || "03";
  const eyebrow = content?.team_eyebrow || "TEAM";
  const title = content?.team_title || "Our people\nare our company.";
  const quote = content?.team_quote || "Expertise becomes meaningful when it is shared.";
  const ctaLabel = content?.team_cta_label || "MEET OUR TEAM";
  const ctaUrl = content?.team_cta_url || "#contact";

  return (
    <section id="team" className="py-20 sm:py-32 bg-[#0a0b0d] text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 sm:mb-16 pb-6 sm:pb-8 border-b border-white/10 gap-6">
          <div>
            <SectionLabel number={sectionNumber} label={eyebrow} theme="dark" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white font-normal tracking-tight mt-3">
              {title}
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end gap-5 lg:gap-10">
            <p className="text-xs sm:text-sm md:text-base text-white/70 font-light leading-relaxed max-w-sm">
              {quote}
            </p>
            <div className="shrink-0">
              <Link
                href={ctaUrl}
                className="inline-flex items-center gap-3 text-xs uppercase font-mono tracking-[0.22em] text-[#c47d48] hover:text-[#e09b68] font-semibold transition-colors group pb-1 border-b border-[#c47d48]/40 hover:border-[#c47d48]"
              >
                <span>{ctaLabel}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Team Cards: Mobile Horizontal Swipe Carousel & Desktop Responsive Grid */}
        {team.length > 0 ? (
          <div>
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className={`flex sm:grid overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none gap-4 sm:gap-6 lg:gap-8 pb-3 sm:pb-0 -mx-6 px-6 sm:mx-0 sm:px-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
                team.length === 1
                  ? "sm:grid-cols-1 max-w-sm mx-auto"
                  : team.length === 2
                  ? "sm:grid-cols-2 max-w-3xl mx-auto"
                  : team.length === 3
                  ? "sm:grid-cols-2 lg:grid-cols-3"
                  : team.length === 4
                  ? "sm:grid-cols-2 lg:grid-cols-4"
                  : team.length === 5
                  ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
                  : "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              }`}
            >
              {team.map((member) => {
                const isExpanded = Boolean(expandedIds[member.id]);
                const hasSubtext = Boolean(
                  (member.qualification && member.qualification.trim().length > 0) ||
                  (member.bio && member.bio.trim().length > 2)
                );

                return (
                  <div
                    key={member.id}
                    className="w-[74vw] max-w-[270px] sm:w-auto shrink-0 sm:shrink snap-start sm:snap-align-none bg-[#121418] border border-white/10 p-4 sm:p-5 flex flex-col justify-between group hover:border-[#c47d48]/50 transition-all duration-300"
                  >
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#181b22] mb-4 sm:mb-5">
                      {member.image_url ? (
                        <Image
                          src={member.image_url}
                          alt={member.name}
                          fill
                          sizes="(max-width: 640px) 270px, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#1c202a] text-white/30 font-mono text-xs">
                          Portrait
                        </div>
                      )}
                    </div>

                    <div className="space-y-2.5 sm:space-y-3">
                      <div className="flex items-end justify-between gap-2">
                        <div className="space-y-0.5 sm:space-y-1 min-w-0">
                          <h3 className="text-sm sm:text-base md:text-lg font-serif tracking-tight text-white group-hover:text-white/90 truncate">
                            {member.name}
                          </h3>
                          <p className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-white/60 truncate">
                            {member.designation}
                          </p>
                        </div>

                        {hasSubtext && (
                          <button
                            type="button"
                            onClick={() => toggleMember(member.id)}
                            aria-expanded={isExpanded}
                            aria-label={
                              isExpanded
                                ? `Collapse details for ${member.name}`
                                : `Expand details for ${member.name}`
                            }
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-all duration-300 shrink-0 cursor-pointer mb-0.5 ${
                              isExpanded
                                ? "border-[#c47d48] bg-[#c47d48]/15 text-[#c47d48]"
                                : "border-white/20 bg-white/5 text-white/70 hover:border-[#c47d48]/80 hover:text-[#c47d48] hover:bg-[#c47d48]/10"
                            }`}
                          >
                            <Plus
                              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 ${
                                isExpanded ? "rotate-45" : ""
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      {hasSubtext && (
                        <div
                          className={`grid transition-all duration-300 ease-in-out ${
                            isExpanded
                              ? "grid-rows-[1fr] opacity-100 pt-2.5 border-t border-white/10"
                              : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden space-y-1.5">
                            {member.qualification && member.qualification.trim().length > 0 && (
                              <p className="text-[11px] sm:text-xs text-[#c47d48] font-mono tracking-tight">
                                {member.qualification}
                              </p>
                            )}
                            {member.bio && member.bio.trim().length > 2 && (
                              <p className="text-[11px] text-white/45 font-sans leading-relaxed pt-0.5">
                                {member.bio}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile Carousel Controls & Dot Indicator (Mobile Only) */}
            <div className="flex sm:hidden items-center justify-between mt-5 pt-4 border-t border-white/10 px-1">
              {/* Slide Counter */}
              <div className="text-[11px] font-mono tracking-widest text-white/50">
                <span className="text-[#c47d48] font-semibold">
                  {String(activeMobileIndex + 1).padStart(2, "0")}
                </span>
                <span className="mx-1.5 text-white/25">/</span>
                <span>{String(team.length).padStart(2, "0")}</span>
              </div>

              {/* Progress Dots */}
              <div className="flex items-center gap-1.5">
                {team.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => scrollToIndex(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeMobileIndex === i
                        ? "w-5 bg-[#c47d48]"
                        : "w-1.5 bg-white/20 hover:bg-white/40"
                    }`}
                    aria-label={`Go to team member ${i + 1}`}
                  />
                ))}
              </div>

              {/* Arrow Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollToIndex(Math.max(0, activeMobileIndex - 1))}
                  disabled={activeMobileIndex === 0}
                  className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/70 disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#c47d48] hover:text-[#c47d48] transition-colors"
                  aria-label="Previous team member"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollToIndex(Math.min(team.length - 1, activeMobileIndex + 1))}
                  disabled={activeMobileIndex === team.length - 1}
                  className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/70 disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#c47d48] hover:text-[#c47d48] transition-colors"
                  aria-label="Next team member"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Clean empty state if no team members are in the database yet */
          <div className="p-12 border border-dashed border-white/15 bg-white/[0.02] text-center space-y-3">
            <p className="font-serif text-lg text-white/60 italic">
              Leadership and Engineering Team profile in update.
            </p>
            <p className="text-xs font-mono tracking-wider text-white/40">
              Profiles will appear once added to the management panel.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

