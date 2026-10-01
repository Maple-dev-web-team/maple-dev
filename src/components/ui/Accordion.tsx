"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

export interface AccordionItem {
  id: string;
  number?: string;
  title: string;
  content: string | React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpenIndex?: number;
  className?: string;
}

export function Accordion({
  items,
  defaultOpenIndex = 0,
  className = "",
}: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={`divide-y divide-black/10 border-y border-black/10 ${className}`}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.id} className="group transition-colors duration-200">
            <button
              onClick={() => toggleItem(index)}
              className="w-full py-5 px-1 flex items-center justify-between text-left focus:outline-none"
              aria-expanded={isOpen}
            >
              <div className="flex items-baseline gap-4 sm:gap-6 pr-4">
                {item.number && (
                  <span className="text-xs font-mono font-medium text-black/50 tracking-wider shrink-0">
                    {item.number}
                  </span>
                )}
                <span className="text-base sm:text-lg font-medium text-[#121418] group-hover:text-black tracking-tight">
                  {item.title}
                </span>
              </div>
              <div className="shrink-0 text-black/60 group-hover:text-black p-1 transition-transform">
                {isOpen ? (
                  <Minus className="w-4 h-4 stroke-[1.5]" />
                ) : (
                  <Plus className="w-4 h-4 stroke-[1.5]" />
                )}
              </div>
            </button>

            {isOpen && (
              <div className="pb-6 pt-1 px-1 pl-8 sm:pl-12 text-sm text-[#121418]/70 leading-relaxed font-light">
                {typeof item.content === "string" ? (
                  <p className="whitespace-pre-line">{item.content}</p>
                ) : (
                  item.content
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
