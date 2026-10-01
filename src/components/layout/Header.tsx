"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapleLogo } from "@/components/ui/MapleLogo";
import { Menu, X, ArrowUpRight } from "lucide-react";
import type { SiteSettings } from "@/types/database";

interface HeaderProps {
  settings?: SiteSettings | null;
}

export function Header({ settings }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/#about" },
    { label: "Services", href: "/#services" },
    { label: "Team", href: "/#team" },
    { label: "Clients", href: "/#clients" },
    { label: "Projects", href: "/projects" },
    { label: "Contact", href: "/#contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-[#0a0b0d]/90 backdrop-blur-md border-b border-white/10 py-3.5 shadow-2xl"
            : isHomePage
            ? "bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5"
            : "bg-[#0a0b0d] py-4 border-b border-white/10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <MapleLogo
              variant="light"
              size="md"
              logoUrl={settings?.logo_url}
            />
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs uppercase tracking-[0.16em] text-white/80 hover:text-white transition-colors duration-200 font-medium py-1 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-white transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Right Action: Let's Talk CTA */}
          <div className="hidden sm:flex items-center gap-4">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-black/60 hover:bg-black/90 text-white text-xs uppercase tracking-[0.18em] border border-white/30 hover:border-white transition-all duration-300 rounded-none shadow-sm"
            >
              <span>Let&apos;s Talk</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white/90 hover:text-white focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#0a0b0d] text-white flex flex-col justify-between p-8 transition-transform duration-500 lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="pt-20">
          <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-white/40 mb-6">
            Navigation
          </div>
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-serif tracking-wide text-white/90 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 space-y-4 text-sm text-white/60">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1">
              Direct Contact
            </div>
            <a
              href={`tel:${settings?.phone || "+918281334435"}`}
              className="block text-white hover:underline text-sm font-medium"
            >
              {settings?.phone || "+91 8281 33 44 35"}
            </a>
            <a
              href={`mailto:${settings?.email || "maplececlt@gmail.com"}`}
              className="block text-white/70 hover:underline text-xs mt-1"
            >
              {settings?.email || "maplececlt@gmail.com"}
            </a>
          </div>

          <Link
            href="/#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full inline-flex items-center justify-center gap-2 py-3 bg-white text-black text-xs font-semibold uppercase tracking-[0.18em]"
          >
            <span>Let&apos;s Talk</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
