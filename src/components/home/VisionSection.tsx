import React from "react";
import Image from "next/image";
import type { HomepageContent } from "@/types/database";

interface VisionSectionProps {
  content?: HomepageContent | null;
}

export function VisionSection({ content }: VisionSectionProps) {
  const visionEyebrow = content?.vision_eyebrow || "OUR VISION";
  const visionTitle = content?.vision_title || "Shaping A\nBetter World";
  const visionImageUrl = content?.vision_image_url;

  const purposeEyebrow = content?.purpose_eyebrow || "OUR PURPOSE";
  const purposeTitleLine1 = content?.purpose_title_line1 || "NURTURING";
  const purposeTitleLine2 = content?.purpose_title_line2 || "GROWTH";
  const purposeTagline =
    content?.purpose_tagline || "PEOPLE STRUCTURED COMMUNITIES A RENOWNED TOMORROW";

  return (
    <section className="relative w-full border-t border-b border-black/10 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px] sm:min-h-[520px]">
        {/* Left Side: Massive Vision Image (~60%) */}
        <div className="lg:col-span-7 relative min-h-[380px] sm:min-h-[480px] bg-[#1a1d24] flex flex-col justify-end p-8 sm:p-12 text-white overflow-hidden">
          {visionImageUrl ? (
            <div className="absolute inset-0 z-0">
              <Image
                src={visionImageUrl}
                alt="Maple Vision - Infrastructure and Engineering"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center brightness-85 contrast-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />
            </div>
          ) : (
            <div className="absolute inset-0 z-0 bg-gradient-to-tr from-[#141820] via-[#1e232e] to-[#12141a]">
              {/* Subtle architectural curve lines */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 10% 90%, rgba(255,255,255,0.15) 0%, transparent 60%)",
                }}
              />
            </div>
          )}

          <div className="relative z-10 max-w-md">
            <div className="inline-flex items-center gap-3 text-[11px] font-mono tracking-[0.25em] uppercase text-white/70 mb-4">
              <span className="w-8 h-[1px] bg-white/40" />
              <span>{visionEyebrow}</span>
            </div>
            <h3 className="text-3xl sm:text-5xl md:text-6xl font-serif text-white font-normal leading-[1.1] whitespace-pre-line tracking-tight">
              {visionTitle}
            </h3>
          </div>
        </div>

        {/* Right Side: Editorial Purpose Statement (~40%) */}
        <div className="lg:col-span-5 bg-[#edebe4] text-[#121418] p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-black/10">
          <div>
            <div className="text-[11px] font-mono tracking-[0.25em] uppercase text-black/50 mb-8 sm:mb-12">
              {purposeEyebrow}
            </div>

            <div className="space-y-1">
              <span className="block font-serif text-3xl sm:text-4xl md:text-5xl font-light italic text-[#121418]/90">
                {purposeTitleLine1}
              </span>
              <span className="block font-sans text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-[#121418]">
                {purposeTitleLine2}
              </span>
            </div>
          </div>

          <div className="pt-12 sm:pt-16">
            <div className="border-t border-black/15 pt-6 text-[10px] sm:text-[11px] font-mono tracking-[0.25em] uppercase text-black/60 leading-relaxed">
              {purposeTagline}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
