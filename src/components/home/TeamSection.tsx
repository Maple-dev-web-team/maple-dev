"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { HomepageContent, TeamMember } from "@/types/database";

interface TeamSectionProps {
  content?: HomepageContent | null;
  team?: TeamMember[];
}

export function TeamSection({ content, team = [] }: TeamSectionProps) {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleMember = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const sectionNumber = content?.team_section_number || "03";
  const eyebrow = content?.team_eyebrow || "TEAM";
  const title = content?.team_title || "Our people\nare our company.";
  const quote = content?.team_quote || "Expertise becomes meaningful when it is shared.";
  const ctaLabel = content?.team_cta_label || "MEET OUR TEAM";
  const ctaUrl = content?.team_cta_url || "#contact";

  return (
    <section id="team" className="py-24 sm:py-32 bg-[#0a0b0d] text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 sm:mb-16 pb-8 border-b border-white/10 gap-6">
          <div>
            <SectionLabel number={sectionNumber} label={eyebrow} theme="dark" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white font-normal tracking-tight mt-3">
              {title}
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end gap-6 lg:gap-10">
            <p className="text-sm sm:text-base text-white/70 font-light leading-relaxed max-w-sm">
              {quote}
            </p>
            <div className="shrink-0">
              <Link
                href={ctaUrl}
                className="inline-flex items-center gap-3 text-xs uppercase font-mono tracking-[0.22em] text-white/90 hover:text-white font-semibold pb-1 border-b border-white/30 hover:border-white transition-colors group"
              >
                <span>{ctaLabel}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Dynamic Responsive Team Grid */}
        {team.length > 0 ? (
          <div
            className={`grid gap-6 sm:gap-8 ${
              team.length === 1
                ? "grid-cols-1 max-w-sm mx-auto"
                : team.length === 2
                ? "grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto"
                : team.length === 3
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : team.length === 4
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                : team.length === 5
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
                : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
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
                  className="bg-[#121418] border border-white/10 p-4 sm:p-5 flex flex-col justify-between group hover:border-[#c47d48]/40 transition-all duration-300"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#181b22] mb-5">
                    {member.image_url ? (
                      <Image
                        src={member.image_url}
                        alt={member.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#1c202a] text-white/30 font-mono text-xs">
                        Portrait
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-end justify-between gap-3">
                      <div className="space-y-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-serif tracking-tight text-white group-hover:text-white/90 truncate">
                          {member.name}
                        </h3>
                        <p className="text-xs font-mono uppercase tracking-wider text-white/60 truncate">
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
