import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { HomepageContent, TeamMember } from "@/types/database";

interface TeamSectionProps {
  content?: HomepageContent | null;
  team?: TeamMember[];
}

export function TeamSection({ content, team = [] }: TeamSectionProps) {
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
              team.slice(0, 3).map((member) => (
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
                        className="object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#1c202a] text-white/30 font-mono text-xs">
                        Portrait
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-base sm:text-lg font-serif tracking-tight text-white group-hover:text-white/90">
                      {member.name}
                    </h3>
                    <p className="text-xs font-mono uppercase tracking-wider text-white/60">
                      {member.designation}
                    </p>
                    {member.qualification && (
                      <p className="text-[11px] text-white/40 font-mono tracking-tight pt-1">
                        {member.qualification}
                      </p>
                    )}
                  </div>
                </div>
              ))
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
