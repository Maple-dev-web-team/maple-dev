import React from "react";

interface SectionLabelProps {
  number?: string;
  label: string;
  theme?: "light" | "dark";
  className?: string;
}

export function SectionLabel({
  number,
  label,
  theme = "dark",
  className = "",
}: SectionLabelProps) {
  const isDarkTheme = theme === "dark"; // on dark background
  const textColor = isDarkTheme ? "text-white/60" : "text-[#121418]/60";
  const numColor = isDarkTheme ? "text-white/80" : "text-[#121418]/80";
  const lineColor = isDarkTheme ? "bg-white/30" : "bg-[#121418]/25";

  return (
    <div
      className={`inline-flex items-center gap-3 text-[11px] font-mono tracking-[0.25em] uppercase select-none ${className}`}
    >
      {number && <span className={`${numColor} font-semibold`}>{number}</span>}
      {number && <span className={`w-8 h-[1px] ${lineColor}`} />}
      <span className={textColor}>{label}</span>
    </div>
  );
}
