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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Heading & Editorial Statement (~4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            <SectionLabel number={sectionNumber} label={eyebrow} theme="dark" />

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white font-normal leading-[1.15] whitespace-pre-line tracking-tight">
              {title}
            </h2>

            <p className="text-sm sm:text-base text-white/70 font-light leading-relaxed">
              {quote}
            </p>

            <div className="pt-2">
              <Link
                href={ctaUrl}
                className="inline-flex items-center gap-3 text-xs uppercase font-mono tracking-[0.22em] text-white/90 hover:text-white font-semibold pb-1.5 border-b border-white/30 hover:border-white transition-colors group"
              >
                <span>{ctaLabel}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Column: Team Member Cards & Wireframe Metadata (~8 cols) */}
          <div className="lg:col-span-8 flex flex-col md:flex-row items-stretch gap-6 sm:gap-8">
            {team.length > 0 ? (
              team.slice(0, 3).map((member) => {
                const isExpanded = Boolean(expandedIds[member.id]);
                const hasSubtext = Boolean(member.qualification || member.bio);

                return (
                  <div
                    key={member.id}
                    className="flex-1 bg-[#121418] border border-white/10 p-4 sm:p-5 flex flex-col justify-between group hover:border-white/30 transition-all duration-300"
                  >
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#181b22] mb-5">
                      {member.image_url ? (
                        <Image
                          src={member.image_url}
                          alt={member.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
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
                          <h3 className="text-base sm:text-lg font-serif tracking-tight text-white group-hover:text-white/90">
                            {member.name}
                          </h3>
                          <p className="text-xs font-mono uppercase tracking-wider text-white/60">
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
                            {member.qualification && (
                              <p className="text-[11px] sm:text-xs text-white/70 font-mono tracking-tight">
                                {member.qualification}
                              </p>
                            )}
                            {member.bio && (
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
              })
            ) : (
              /* Clean empty state if no team members are in the database yet */
              <div className="flex-1 p-12 border border-dashed border-white/15 bg-white/[0.02] text-center space-y-3">
                <p className="font-serif text-lg text-white/60 italic">
                  Leadership and Engineering Team profile in update.
                </p>
                <p className="text-xs font-mono tracking-wider text-white/40">
                  Profiles will appear once added to the management panel.
                </p>
              </div>
            )}

            {/* Right Edge Technical Wireframe Graphic */}
            <div className="hidden xl:flex flex-col justify-between p-6 border border-white/10 bg-[#0e1014] w-28 shrink-0 select-none">
              <div className="w-8 h-8 border border-white/20 grid grid-cols-2 grid-rows-2">
                <div className="border-r border-b border-white/20" />
                <div className="border-b border-white/20" />
                <div className="border-r border-white/20" />
                <div />
              </div>

              <div className="text-[9px] font-mono tracking-[0.25em] uppercase text-white/40 -rotate-90 origin-left translate-y-24 whitespace-nowrap">
                ENGINEERING COMMITMENT
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
