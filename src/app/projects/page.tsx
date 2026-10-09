import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import {
  getSiteSettings,
  getProjects,
  getProjectCategories,
  getServices,
  getBranches,
} from "@/lib/queries";

export const metadata: Metadata = {
  title: "Projects Portfolio",
  description:
    "Explore our civil and structural engineering projects portfolio. Engineering case studies in commercial complexes, multispecialty hospitals, academic campus blocks, residential villas, and PEB industrial hubs across Calicut, Kochi, Palakkad, and Bengaluru.",
  alternates: {
    canonical: "https://maplece.com/projects",
  },
  openGraph: {
    title: "Projects Portfolio | Maple Consulting Engineers",
    description:
      "Explore our civil and structural engineering projects portfolio across commercial, healthcare, educational, and industrial sectors.",
    url: "https://maplece.com/projects",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Maple Consulting Engineers - Projects Portfolio",
      },
    ],
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const resolvedParams = await searchParams;
  const categoryFilter = resolvedParams.category;

  const [settings, categories, allProjects, services, branches] =
    await Promise.all([
      getSiteSettings(),
      getProjectCategories(),
      getProjects(),
      getServices(),
      getBranches(),
    ]);

  const activeCat = categories.find((c) => c.slug === categoryFilter);
  const filteredProjects = categoryFilter
    ? allProjects.filter(
        (p) =>
          p.category?.slug === categoryFilter ||
          p.category_id === categoryFilter ||
          (activeCat && p.category_id === activeCat.id)
      )
    : allProjects;

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://maplece.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projects Portfolio",
        item: "https://maplece.com/projects",
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0b0d] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <Header settings={settings} />

      <main className="flex-1 pt-36 pb-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          {/* Page Header */}
          <div className="border-b border-white/10 pb-12 mb-12">
            <SectionLabel number="05" label="PORTFOLIO" theme="dark" />
            <h1 className="text-4xl sm:text-6xl font-serif font-normal text-white mt-4 tracking-tight">
              Featured Projects &amp; Works
            </h1>
            <p className="text-white/60 max-w-2xl mt-4 font-light text-base leading-relaxed">
              Demonstrating our civil and structural engineering expertise across
              diverse sectors, with focus on safety, sustainability, and architectural elegance.
            </p>

            {/* Category Filter Tabs */}
            {categories.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 mt-8 pt-6 border-t border-white/10">
                <Link
                  href="/projects"
                  className={`px-4 py-2 text-xs font-mono tracking-wider uppercase transition-colors ${
                    !categoryFilter
                      ? "bg-white text-black font-semibold"
                      : "bg-white/5 text-white/70 hover:bg-white/15"
                  }`}
                >
                  All Projects
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/projects?category=${cat.slug}`}
                    className={`px-4 py-2 text-xs font-mono tracking-wider uppercase transition-colors ${
                      categoryFilter === cat.slug
                        ? "bg-white text-black font-semibold"
                        : "bg-white/5 text-white/70 hover:bg-white/15"
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="group flex flex-col bg-[#121418] border border-white/10 overflow-hidden hover:border-white/40 transition-all duration-300"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#181b22]">
                    {project.cover_image_url ? (
                      <Image
                        src={project.cover_image_url}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[#161a24] flex items-center justify-center">
                        <span className="font-mono text-xs text-white/30 uppercase tracking-widest">
                          Engineering Case Study
                        </span>
                      </div>
                    )}
                    {project.category && (
                      <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-sm px-2.5 py-1 text-[10px] font-mono tracking-widest text-white/90 uppercase border border-white/10">
                        {project.category.name}
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <h2 className="text-xl font-serif text-white group-hover:text-white/90 transition-colors">
                          {project.title}
                        </h2>
                        <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors shrink-0 mt-1" />
                      </div>

                      {project.short_description && (
                        <p className="text-xs text-white/60 font-light mt-3 line-clamp-2 leading-relaxed">
                          {project.short_description}
                        </p>
                      )}
                    </div>

                    <div className="pt-6 mt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/40 uppercase tracking-wider">
                      <span>{project.location || "Calicut, India"}</span>
                      {project.completion_year && (
                        <span>{project.completion_year}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-24 border border-dashed border-white/15 bg-white/[0.02] text-center space-y-3">
              <p className="font-serif text-xl text-white/70 italic">
                No projects found in this category.
              </p>
              <p className="text-xs font-mono tracking-wider text-white/40">
                Please check back soon or browse all categories.
              </p>
              <div className="pt-4">
                <Link
                  href="/projects"
                  className="inline-block px-5 py-2.5 bg-white text-black text-xs font-mono uppercase tracking-widest font-semibold"
                >
                  View All Projects
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer settings={settings} services={services} branches={branches} />
    </div>
  );
}
