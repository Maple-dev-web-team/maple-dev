import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { HomepageContent, Project, ProjectCategory } from "@/types/database";

interface ProjectsSectionProps {
  content?: HomepageContent | null;
  projects?: Project[];
  categories?: ProjectCategory[];
}

export function ProjectsSection({
  content,
  projects = [],
  categories = [],
}: ProjectsSectionProps) {
  const sectionNumber = content?.projects_section_number || "05";
  const eyebrow = content?.projects_eyebrow || "PROJECTS";
  const title = content?.projects_title || "Every Project is Unique";
  const description =
    content?.projects_description ||
    "We approach every design challenge with a passion for solving problems. Our goal is to provide good quality works and services in everything we do.";
  const ctaLabel = content?.projects_cta_label || "VIEW ALL PROJECTS";
  const ctaUrl = content?.projects_cta_url || "/projects";

  // Use projects or categories to display the 5 cards
  const displayItems =
    categories.length > 0
      ? categories.slice(0, 5).map((cat) => ({
          id: cat.id,
          title: `${cat.name} Projects`,
          href: `/projects?category=${cat.slug}`,
          imageUrl: cat.cover_image_url,
        }))
      : projects.slice(0, 5).map((proj) => ({
          id: proj.id,
          title: proj.title,
          href: `/projects/${proj.slug}`,
          imageUrl: proj.cover_image_url,
        }));

  return (
    <section id="projects" className="py-24 sm:py-32 bg-[#0a0b0d] text-white relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-12 sm:pb-16 border-b border-white/10">
          <div className="lg:col-span-5 space-y-3">
            <SectionLabel number={sectionNumber} label={eyebrow} theme="dark" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white font-normal tracking-tight">
              {title}
            </h2>
          </div>

          <div className="lg:col-span-4 text-xs sm:text-sm text-white/70 font-light leading-relaxed">
            <p>{description}</p>
          </div>

          <div className="lg:col-span-3 lg:text-right">
            <Link
              href={ctaUrl}
              className="inline-flex items-center gap-2 text-xs uppercase font-mono tracking-[0.2em] text-white/90 hover:text-white font-semibold pb-1 border-b border-white/30 hover:border-white transition-colors group"
            >
              <span>{ctaLabel}</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        {/* 5-Column Project Category Showcase Cards */}
        {displayItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 pt-12">
            {displayItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="group flex flex-col justify-between bg-[#121418] border border-white/10 overflow-hidden hover:border-white/30 transition-all duration-300"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#181b22]">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-t from-[#151922] to-[#1c2230] flex items-center justify-center">
                      <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">
                        Architecture
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                </div>

                <div className="p-4 flex items-center justify-between gap-2 border-t border-white/5">
                  <span className="text-xs sm:text-sm font-medium text-white/90 group-hover:text-white transition-colors line-clamp-1">
                    {item.title}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Graceful empty state when no projects are in the database */
          <div className="pt-12">
            <div className="p-16 border border-dashed border-white/15 bg-white/[0.02] text-center space-y-3">
              <p className="font-serif text-lg text-white/60 italic">
                Project portfolio currently undergoing curation.
              </p>
              <p className="text-xs font-mono tracking-wider text-white/40">
                New engineering case studies will be published shortly.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
