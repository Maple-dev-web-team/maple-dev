import React from "react";
import Link from "next/link";
import { MapleLogo } from "@/components/ui/MapleLogo";
import { MapPin, Phone, Mail } from "lucide-react";
import type { SiteSettings, Service, Branch } from "@/types/database";

interface FooterProps {
  settings?: SiteSettings | null;
  services?: Service[];
  branches?: Branch[];
}

export function Footer({ settings, services = [], branches = [] }: FooterProps) {
  const currentYear = new Date().getFullYear();

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
    <footer className="bg-[#0a0b0d] text-white pt-20 pb-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-white/10">
          {/* Column 1: Brand & Statement (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <MapleLogo
              variant="light"
              size="md"
              logoUrl={settings?.logo_url}
            />
            <p className="text-sm text-white/60 leading-relaxed font-light pr-4">
              {settings?.tagline ||
                "A Civil and Structural Engineering consultancy delivering innovative, practical and sustainable solutions for a better built environment."}
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-2">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Navigation (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-white/40">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-xs text-white/70 hover:text-white tracking-wide transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Our Services (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-white/40">
              Our Services
            </h4>
            {services.length > 0 ? (
              <ul className="space-y-2.5">
                {services.slice(0, 8).map((service) => (
                  <li key={service.id}>
                    <Link
                      href={`/#services`}
                      className="text-xs text-white/70 hover:text-white line-clamp-1 tracking-wide transition-colors"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-white/30 italic">Services available upon request</p>
            )}
          </div>

          {/* Column 4: Contact (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-white/40">
              Contact
            </h4>
            <div className="space-y-3 text-xs text-white/70">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {settings?.address ||
                    "Near Popular Vehicle Showroom, Meleparamba, Calicut"}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <a
                    href={`tel:${settings?.phone || "+918281334435"}`}
                    className="block hover:text-white"
                  >
                    {settings?.phone || "+91 8281 33 44 35"}
                  </a>
                  {settings?.phone_alt && (
                    <a
                      href={`tel:${settings?.phone_alt}`}
                      className="block hover:text-white"
                    >
                      {settings.phone_alt}
                    </a>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
                <a
                  href={`mailto:${settings?.email || "maplececlt@gmail.com"}`}
                  className="hover:text-white break-all"
                >
                  {settings?.email || "maplececlt@gmail.com"}
                </a>
              </div>
            </div>
          </div>

          {/* Column 5: Our Branches (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-white/40">
              Our Branches
            </h4>
            {branches.length > 0 ? (
              <ul className="space-y-2 text-xs text-white/70">
                {branches.map((b) => (
                  <li key={b.id} className="hover:text-white">
                    {b.name}
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-2 text-xs text-white/70">
                <li>Palakkad</li>
                <li>Kochi</li>
                <li>Koramangala (Bangalore)</li>
              </ul>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 gap-4">
          <div>
            {settings?.copyright_text ||
              `© ${currentYear} Maple Consulting Engineers. All rights reserved.`}
          </div>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms</span>
            <span>Sitemap</span>
            <Link
              href="/admin/login"
              className="text-white/30 hover:text-white/70 transition-colors ml-4"
            >
              CMS Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
