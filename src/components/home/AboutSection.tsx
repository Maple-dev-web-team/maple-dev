import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { HomepageContent } from "@/types/database";

interface AboutSectionProps {
  content?: HomepageContent | null;
}

export function AboutSection({ content }: AboutSectionProps) {
  const sectionNumber = content?.about_section_number || "01";
  const eyebrow = content?.about_eyebrow || "ABOUT US";
  const title = content?.about_title || "Built on experience.\nDriven by possibility.";
  const description1 =
    content?.about_description_1 ||
    "Maple consulting engineers are a Civil and Structural Engineering consultancy offering a nationwide service to our clients. Our experience and expertise allow us to offer a range of specialist services, all integrated to serve the needs and requirements of clients in the sectors in which we operate. We provide innovative structural design and analysis services to architects, owners, and developers for all types of buildings at all project phases.";
  const description2 =
    content?.about_description_2 ||
    "Maple consulting engineers undertakes a wide variety of work, ranging from major new build schemes through to complex renovation projects across the market sectors in which we operate. We are involved in consulting projects across both the public and private sectors.";
  const ctaLabel = content?.about_cta_label || "MORE ABOUT US";
  const ctaUrl = content?.about_cta_url || "#contact";
  const imageUrl = content?.about_image_url;

  return (
    <section id="about" className="py-24 sm:py-32 bg-[#f7f6f2] text-[#121418] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Architectural / Drafting Image */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] sm:aspect-[5/4] w-full overflow-hidden bg-[#e6e3dc] shadow-sm">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="About Maple Consulting Engineers"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center grayscale-[0.1] contrast-[1.05] hover:scale-105 transition-transform duration-700 ease-out"
                />
              ) : (
                /* Editorial neutral fallback frame if no custom image is uploaded yet */
                <div className="absolute inset-0 flex flex-col justify-between p-8 bg-gradient-to-br from-[#dfdbd2] to-[#cbcdc4] text-black/60">
                  <div className="font-mono text-xs uppercase tracking-widest text-black/40">
                    Maple Engineering Archives
                  </div>
                  <div className="space-y-2">
                    <div className="font-serif text-2xl italic text-black/80">
                      Precision in every line.
                    </div>
                    <p className="text-xs font-mono text-black/50 tracking-wider">
                      Structural Analysis • Detailing • Supervision
                    </p>
                  </div>
                </div>
              )}
            </div>
            {/* Subtle corner architectural accent line */}
            <div className="hidden sm:block absolute -bottom-4 -left-4 w-12 h-12 border-b border-l border-black/20 pointer-events-none" />
          </div>

          {/* Right Column: Editorial Text Block */}
          <div className="lg:col-span-6 space-y-8">
            <SectionLabel number={sectionNumber} label={eyebrow} theme="light" />

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#121418] font-normal leading-[1.15] whitespace-pre-line tracking-tight">
              {title}
            </h2>

            <div className="space-y-5 text-sm sm:text-base text-[#121418]/75 leading-relaxed font-light">
              <p>{description1}</p>
              {description2 && <p>{description2}</p>}
            </div>

            <div className="pt-4">
              <Link
                href={ctaUrl}
                className="inline-flex items-center gap-3 text-xs uppercase font-mono tracking-[0.22em] text-[#121418] hover:text-black font-semibold pb-1.5 border-b border-black/40 hover:border-black transition-colors group"
              >
                <span>{ctaLabel}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
