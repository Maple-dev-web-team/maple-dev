import React from "react";
import Link from "next/link";
import Image from "next/image";

interface MapleLogoProps {
  variant?: "light" | "dark";
  className?: string;
  isLink?: boolean;
  size?: "sm" | "md" | "lg";
  logoUrl?: string | null;
}

export function MapleLogo({
  variant = "dark",
  className = "",
  isLink = true,
  size = "md",
  logoUrl,
}: MapleLogoProps) {
  const isLight = variant === "light";
  const textColor = isLight ? "text-white" : "text-[#121418]";
  const subtextColor = isLight ? "text-white/80" : "text-[#121418]/70";
  const iconFill = isLight ? "#ffffff" : "#121418";

  const sizeClasses = {
    sm: "h-8",
    md: "h-11",
    lg: "h-14",
  };

  const content = (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      {logoUrl ? (
        <div className={`relative ${sizeClasses[size]} w-auto aspect-video shrink-0`}>
          <Image
            src={logoUrl}
            alt="Maple Consulting Engineers"
            fill
            sizes="160px"
            className="object-contain"
            priority
          />
        </div>
      ) : (
        <>
          {/* SVG Vector recreation of the 5-tier Maple structural wave mark */}
          <svg
            viewBox="0 0 100 80"
            fill={iconFill}
            className={`${sizeClasses[size]} w-auto shrink-0 transition-transform duration-300`}
            aria-label="Maple Logo Icon"
          >
            {/* Layer 1 - Top crests M-depression */}
            <path d="M 0,26 C 15,26 22,14 36,14 C 44,14 47,21 50,26 C 53,21 56,14 64,14 C 78,14 85,26 100,26 L 100,34 C 85,34 78,22 64,22 C 56,22 53,29 50,34 C 47,29 44,22 36,22 C 22,22 15,34 0,34 Z" />
            {/* Layer 2 */}
            <path d="M 0,38 C 15,38 22,26 36,26 C 44,26 47,33 50,38 C 53,33 56,26 64,26 C 78,26 85,38 100,38 L 100,46 C 85,46 78,34 64,34 C 56,34 53,41 50,46 C 47,41 44,34 36,34 C 22,34 15,46 0,46 Z" />
            {/* Layer 3 */}
            <path d="M 0,50 C 15,50 22,38 36,38 C 44,38 47,45 50,50 C 53,45 56,38 64,38 C 78,38 85,50 100,50 L 100,58 C 85,58 78,46 64,46 C 56,46 53,53 50,58 C 47,53 44,46 36,46 C 22,46 15,58 0,58 Z" />
            {/* Layer 4 */}
            <path d="M 0,62 C 15,62 22,50 36,50 C 44,50 47,57 50,62 C 53,57 56,50 64,50 C 78,50 85,62 100,62 L 100,70 C 85,70 78,58 64,58 C 56,58 53,65 50,70 C 47,65 44,58 36,58 C 22,58 15,70 0,70 Z" />
            {/* Layer 5 - Bottom wave */}
            <path d="M 0,74 C 15,74 22,62 36,62 C 44,62 47,69 50,74 C 53,69 56,62 64,62 C 78,62 85,74 100,74 L 100,80 L 74,80 C 64,80 57,75 50,75 C 43,75 36,80 26,80 L 0,80 Z" />
          </svg>

          {/* Typography: MAPLE CONSULTING ENGINEERS */}
          <div className="flex flex-col tracking-wider">
            <span
              className={`font-sans font-extrabold leading-none tracking-[0.14em] ${textColor} ${
                size === "sm" ? "text-lg" : size === "lg" ? "text-2xl" : "text-xl"
              }`}
            >
              MAPLE
            </span>
            <span
              className={`font-sans font-medium uppercase leading-tight tracking-[0.18em] ${subtextColor} ${
                size === "sm"
                  ? "text-[8px] mt-0.5"
                  : size === "lg"
                  ? "text-[11px] mt-1"
                  : "text-[9.5px] mt-1"
              }`}
            >
              CONSULTING ENGINEERS
            </span>
          </div>
        </>
      )}
    </div>
  );

  if (isLink) {
    return (
      <Link href="/" className="inline-block group focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
