"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
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

  // Compile up to 3 banner slots
  const allBanners = [
    { url: content?.hero_image_url, id: "01", label: "01" },
    { url: content?.hero_image_2_url, id: "02", label: "02" },
    { url: content?.hero_image_3_url, id: "03", label: "03" },
  ];

  // Active slides with valid URLs
  const activeSlides = allBanners.filter((b) => Boolean(b.url)) as Array<{
    url: string;
    id: string;
    label: string;
  }>;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    if (activeSlides.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    }
  }, [activeSlides.length]);

  const prevSlide = useCallback(() => {
    if (activeSlides.length > 1) {
      setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
    }
  }, [activeSlides.length]);

  // Auto-slide effect (every 5.5s)
  useEffect(() => {
    if (activeSlides.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5500);

    return () => clearInterval(interval);
  }, [activeSlides.length, isPaused, nextSlide]);

  return (
    <section
      className="relative min-h-[100vh] flex flex-col justify-between text-white overflow-hidden bg-[#0c0e12]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Maple Consulting Engineers Hero Showcase"
    >
      {/* Background Banner Slideshow */}
      {activeSlides.length > 0 ? (
        <div className="absolute inset-0 z-0 overflow-hidden">
          {activeSlides.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <div
                key={slide.url}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <Image
                  src={slide.url}
                  alt={`Maple Architectural Engineering Slide ${index + 1}`}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className={`object-cover object-center brightness-90 contrast-[1.05] transition-transform duration-[7000ms] ease-out ${
                    isActive ? "scale-105" : "scale-100"
                  }`}
                />
                {/* Editorial dark overlay vignettes */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/70" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0d] via-transparent to-black/60" />
              </div>
            );
          })}
        </div>
      ) : (
        /* Fallback architectural grid when no banners are uploaded */
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#12151c] via-[#0d0f14] to-[#08090b]">
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
      <div className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 z-20 -rotate-90 origin-left items-center gap-3 pointer-events-none">
        <span className="w-8 h-[1px] bg-white/30" />
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/50 whitespace-nowrap">
          {verticalText}
        </span>
      </div>

      {/* Right Vertical Numbering Markers (Interactive Slide Switchers) */}
      <div className="hidden lg:flex flex-col items-center gap-6 absolute right-8 top-1/2 -translate-y-1/2 z-20 font-mono text-[10px] tracking-widest">
        {[0, 1, 2].map((i) => {
          const isSlotAvailable = i < activeSlides.length;
          const isActive = i === currentIndex;
          const numLabel = `0${i + 1}`;

          return (
            <button
              key={numLabel}
              type="button"
              onClick={() => {
                if (isSlotAvailable) setCurrentIndex(i);
              }}
              disabled={!isSlotAvailable}
              className={`flex flex-col items-center gap-2 transition-all duration-300 group ${
                !isSlotAvailable
                  ? "opacity-20 cursor-default"
                  : isActive
                  ? "text-white opacity-100 scale-110"
                  : "text-white/40 hover:text-white/80 cursor-pointer"
              }`}
              title={isSlotAvailable ? `View banner 0${i + 1}` : `Slot 0${i + 1} not uploaded`}
              aria-label={`Slide ${numLabel}`}
            >
              <span className={`transition-colors ${isActive ? "text-white font-bold" : "group-hover:text-white"}`}>
                {numLabel}
              </span>
              <span
                className={`transition-all duration-500 ${
                  isActive
                    ? "w-5 h-[2px] bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                    : "w-2 h-[1px] bg-white/20 group-hover:w-3 group-hover:bg-white/50"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Manual Slide Navigation Arrows (Desktop overlay) */}
      {activeSlides.length > 1 && (
        <div className="hidden sm:flex items-center gap-2 absolute right-8 bottom-24 z-20">
          <button
            type="button"
            onClick={prevSlide}
            className="w-9 h-9 border border-white/20 hover:border-white text-white/70 hover:text-white flex items-center justify-center transition-all bg-black/40 hover:bg-black/80 backdrop-blur-xs"
            aria-label="Previous banner"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="w-9 h-9 border border-white/20 hover:border-white text-white/70 hover:text-white flex items-center justify-center transition-all bg-black/40 hover:bg-black/80 backdrop-blur-xs"
            aria-label="Next banner"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

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

          {/* CTA Button & Mobile Slide Indicators */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <Link
              href={ctaUrl}
              className="inline-flex items-center gap-3 px-7 py-3.5 bg-black/70 hover:bg-white text-white hover:text-black border border-white/40 hover:border-white text-xs uppercase tracking-[0.22em] font-medium transition-all duration-300 group shadow-lg w-fit"
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            {/* Mobile / Compact Slide Dots */}
            {activeSlides.length > 1 && (
              <div className="flex items-center gap-2 lg:hidden">
                {activeSlides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentIndex(i)}
                    className={`h-1.5 transition-all duration-300 rounded-full ${
                      i === currentIndex ? "w-7 bg-white" : "w-2 bg-white/40"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            )}
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
          <div className="flex items-center gap-4">
            {activeSlides.length > 1 && (
              <span className="text-white/40 font-mono tracking-widest hidden md:inline">
                SLIDE {currentIndex + 1} / {activeSlides.length}
              </span>
            )}
            <div className="tracking-[0.2em] text-white/60">
              STRUCTURES • COMMUNITIES • A RENOWNED TOMORROW
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
