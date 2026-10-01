import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { HomepageContent } from "@/types/database";

interface HeroProps {
  content?: HomepageContent | null;
}

export function Hero({ content }: HeroProps) {
  const eyebrow = content?.hero_eyebrow || "ENGINEERING\nPEOPLE\nPLACES\nBETTER TOMORROW";
  const titleLine1 = content?.hero_title_line1 || "delivering";
  const titleLine2 = content?.hero_title_line2 || "EXCELLENCE";
  const description =
    content?.hero_description ||
    "Every project is an opportunity to build upon our reputation for quality, creativity, and strong relationships.";
  const ctaLabel = content?.hero_cta_label || "DISCOVER MAPLE";
  const ctaUrl = content?.hero_cta_url || "#about";
  const verticalText = content?.hero_vertical_text || "CIVIL & STRUCTURAL ENGINEERING";
  const bgImageUrl = content?.hero_image_url;

  return (
    <section className="relative min-h-[100vh] flex flex-col justify-between text-white overflow-hidden bg-[#0c0e12]">
      {/* Background Image / Architecture Texture */}
      {bgImageUrl ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={bgImageUrl}
            alt="Maple Architectural Engineering"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center brightness-90 contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0d] via-transparent to-black/60" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#12151c] via-[#0d0f14] to-[#08090b]">
          {/* Subtle architectural grid pattern */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0d] via-transparent to-black/50" />
        </div>
      )}

      {/* Left Vertical Stamp / Metadata */}
      <div className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 z-10 -rotate-90 origin-left items-center gap-3 pointer-events-none">
        <span className="w-8 h-[1px] bg-white/30" />
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/50 whitespace-nowrap">
          {verticalText}
        </span>
      </div>

      {/* Right Vertical Numbering Markers */}
      <div className="hidden lg:flex flex-col items-center gap-6 absolute right-8 top-1/2 -translate-y-1/2 z-10 font-mono text-[10px] tracking-widest text-white/40">
        <div className="flex flex-col items-center gap-2">
          <span className="text-white/80">01</span>
          <span className="w-4 h-[1px] bg-white/40" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span>02</span>
          <span className="w-2 h-[1px] bg-white/20" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span>03</span>
          <span className="w-2 h-[1px] bg-white/20" />
        </div>
      </div>

      {/* Main Hero Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full pt-36 sm:pt-44 pb-20 flex-1 flex flex-col justify-center">
        <div className="max-w-3xl">
          {/* Eyebrow List */}
          <div className="text-[11px] sm:text-xs font-mono tracking-[0.25em] text-white/70 uppercase mb-8 leading-relaxed whitespace-pre-line">
            {eyebrow}
          </div>

          {/* Large Editorial Headline */}
          <h1 className="tracking-tight text-white mb-8">
            <span className="block font-serif text-4xl sm:text-6xl md:text-7xl font-light italic leading-none text-white/95 lowercase">
              {titleLine1}
            </span>
            <span className="block font-sans text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold uppercase tracking-tight leading-[0.95] mt-2">
              {titleLine2}
            </span>
          </h1>

          {/* Supporting Paragraph */}
          <p className="text-base sm:text-lg text-white/80 font-light max-w-xl leading-relaxed mb-10">
            {description}
          </p>

          {/* CTA Button */}
          <div className="flex items-center gap-4">
            <Link
              href={ctaUrl}
              className="inline-flex items-center gap-3 px-7 py-3.5 bg-black/70 hover:bg-white text-white hover:text-black border border-white/40 hover:border-white text-xs uppercase tracking-[0.22em] font-medium transition-all duration-300 group shadow-lg"
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Technical Ticker / Metadata Bar */}
      <div className="relative z-10 border-t border-white/10 py-5 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[10px] font-mono tracking-[0.25em] text-white/50 uppercase gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Consultancy Active — Global &amp; National Projects</span>
          </div>
          <div className="tracking-[0.2em] text-white/60">
            STRUCTURES • COMMUNITIES • A RENOWNED TOMORROW
          </div>
        </div>
      </div>
    </section>
  );
}
