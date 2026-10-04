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
            {/* Direct WhatsApp Action if configured */}
            {settings?.whatsapp && (
              <div className="pt-2">
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-emerald-500/20 text-white/70 hover:text-emerald-400 border border-white/10 hover:border-emerald-500/40 text-xs font-mono tracking-wide transition-all"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            )}
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
                    href={`tel:${(settings?.phone || "+918281334435").replace(/\s+/g, "")}`}
                    className="block hover:text-white"
                  >
                    {settings?.phone || "+91 8281 33 44 35"}
                  </a>
                  {settings?.phone_alt && (
                    <a
                      href={`tel:${settings.phone_alt.replace(/\s+/g, "")}`}
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
            <Link
              href="/privacy-policy"
              className="text-xs text-white/40 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <a
              href="https://ekodrix.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/50 hover:text-white transition-colors font-mono tracking-wider inline-flex items-center gap-1.5"
            >
              <span>Crafted By</span>
              <span className="text-white/80 hover:text-[#c47d48] font-medium transition-colors underline decoration-white/20 underline-offset-4">
                Ekodrix
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
