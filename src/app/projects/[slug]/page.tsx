import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft, ArrowUpRight, MapPin, Calendar, Building, Layers } from "lucide-react";
import {
  getSiteSettings,
  getProjectBySlug,
  getProjects,
  getServices,
  getBranches,
} from "@/lib/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolved = await params;
  const project = await getProjectBySlug(resolved.slug);
  if (!project) return { title: "Project Not Found | Maple Consulting Engineers" };

  return {
    title: `${project.title} | Maple Consulting Engineers`,
    description:
      project.short_description ||
      `Engineering case study for ${project.title} by Maple Consulting Engineers.`,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolved = await params;
  const [project, settings, services, branches, allProjects] = await Promise.all([
    getProjectBySlug(resolved.slug),
    getSiteSettings(),
    getServices(),
    getBranches(),
    getProjects({ limit: 4 }),
  ]);

  if (!project) {
    notFound();
  }

  // Filter out current project from related
  const relatedProjects = allProjects
    .filter((p) => p.id !== project.id)
    .slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0b0d] text-white">
      <Header settings={settings} />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          {/* Back Navigation Link */}
          <div className="mb-8">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Projects</span>
            </Link>
          </div>

          {/* Project Title & Category Header */}
          <div className="border-b border-white/10 pb-10 mb-12">
            {project.category && (
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-white/50 block mb-3">
                {project.category.name}
              </span>
            )}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-white font-normal tracking-tight">
              {project.title}
            </h1>
          </div>

          {/* Project Cover Image */}
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#141822] mb-14 border border-white/10">
            {project.cover_image_url ? (
              <Image
                src={project.cover_image_url}
                alt={project.title}
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover object-center"
              />
            ) : (
              <div className="absolute inset-0 bg-[#161a24] flex items-center justify-center">
                <span className="font-mono text-sm text-white/30 uppercase tracking-widest">
                  Maple Structural Engineering
                </span>
              </div>
            )}
          </div>

          {/* Project Details & Technical Specifications Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
            {/* Left Column: Description (~8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-white/40">
                Project Overview
              </h2>
              {project.short_description && (
                <p className="text-xl sm:text-2xl font-serif text-white/90 leading-relaxed font-light">
                  {project.short_description}
                </p>
              )}
              {project.description ? (
                <div className="text-sm sm:text-base text-white/70 leading-relaxed font-light space-y-4 whitespace-pre-line">
                  {project.description}
                </div>
              ) : (
                <p className="text-sm text-white/60 font-light">
                  Comprehensive structural analysis, design and construction supervision
                  provided by Maple Consulting Engineers.
                </p>
              )}
            </div>

            {/* Right Column: Metadata Box (~4 cols) */}
            <div className="lg:col-span-4 bg-[#121418] border border-white/10 p-6 sm:p-8 space-y-6 self-start">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white/40 pb-3 border-b border-white/10">
                Project Details
              </h3>

              {project.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-white/40">
                      Location
                    </div>
                    <div className="text-xs text-white/90 font-medium">
                      {project.location}
                    </div>
                  </div>
                </div>
              )}

              {project.completion_year && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-white/40">
                      Year Completed
                    </div>
                    <div className="text-xs text-white/90 font-medium">
                      {project.completion_year}
                    </div>
                  </div>
                </div>
              )}

              {project.client_name && (
                <div className="flex items-start gap-3">
                  <Building className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-white/40">
                      Client
                    </div>
                    <div className="text-xs text-white/90 font-medium">
                      {project.client_name}
                    </div>
                  </div>
                </div>
              )}

              {project.scope_of_work && (
                <div className="flex items-start gap-3">
                  <Layers className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-white/40">
                      Scope of Work
                    </div>
                    <div className="text-xs text-white/90 font-medium">
                      {project.scope_of_work}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Project Gallery Images (if available) */}
          {project.images && project.images.length > 0 && (
            <div className="py-16 border-b border-white/10">
              <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-white/40 mb-8">
                Visual Documentation &amp; Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.images.map((img) => (
                  <div
                    key={img.id}
                    className="relative aspect-[4/3] w-full overflow-hidden bg-[#161a24] border border-white/10"
                  >
                    <Image
                      src={img.image_url}
                      alt={img.alt_text || project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-center hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Projects */}
          {relatedProjects.length > 0 && (
            <div className="pt-16">
              <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-white/40 mb-8">
                Related Projects
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedProjects.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/projects/${rel.slug}`}
                    className="group bg-[#121418] border border-white/10 overflow-hidden hover:border-white/30 transition-all duration-300"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#181b22]">
                      {rel.cover_image_url ? (
                        <Image
                          src={rel.cover_image_url}
                          alt={rel.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[#161a24]" />
                      )}
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <span className="text-sm font-serif text-white group-hover:text-white/80 transition-colors line-clamp-1">
                        {rel.title}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer settings={settings} services={services} branches={branches} />
    </div>
  );
}
