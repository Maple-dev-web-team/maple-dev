import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ArrowLeft, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { getSiteSettings, getServices, getBranches } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy and client data protection practices for Maple Consulting Engineers. Learn how we handle your project inquiries and engineering data.",
  alternates: {
    canonical: "https://maplece.com/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | Maple Consulting Engineers",
    description:
      "Privacy Policy and client data confidentiality commitment of Maple Consulting Engineers, Calicut.",
    url: "https://maplece.com/privacy-policy",
  },
};

export const dynamic = "force-dynamic";

export default async function PrivacyPolicyPage() {
  const [settings, services, branches] = await Promise.all([
    getSiteSettings(),
    getServices(),
    getBranches(),
  ]);

  const lastUpdated = "October 2026";

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f6f2] text-[#121418]">
      <Header settings={settings} />

      <main className="flex-1 pt-32 pb-24 sm:pb-32">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          {/* Back Navigation */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-black/50 hover:text-black transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Page Header */}
          <div className="pb-10 border-b border-black/10 mb-12">
            <SectionLabel number="00" label="LEGAL & PRIVACY" theme="light" />
            <h1 className="text-4xl sm:text-5xl font-serif text-[#121418] font-normal tracking-tight mt-4 mb-4">
              Privacy Policy
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-black/50 uppercase tracking-wider">
              <span>Maple Consulting Engineers</span>
              <span>•</span>
              <span>Last Updated: {lastUpdated}</span>
            </div>
          </div>

          {/* Privacy Policy Content */}
          <div className="space-y-12 text-[#121418]/85 text-sm sm:text-base leading-relaxed">
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-serif text-[#121418] font-medium tracking-tight">
                1. Overview & Commitment
              </h2>
              <p>
                At <strong>Maple Consulting Engineers</strong>, we respect your privacy and are committed
                to safeguarding the personal data and engineering project materials you share with us.
                This Privacy Policy explains how we collect, handle, and protect your information when
                you visit our website (
                <Link href="/" className="text-[#c47d48] hover:underline font-mono text-xs">
                  maplece.com
                </Link>
                ) or communicate with our engineering consultancy team.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-serif text-[#121418] font-medium tracking-tight">
                2. Information We Collect
              </h2>
              <p>
                We only collect information necessary to respond to your engineering inquiries, evaluate
                project scopes, and provide structural consultancy services:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-black/75">
                <li>
                  <strong>Contact Details:</strong> Your name, email address, phone number, and location
                  submitted through our contact and consultation request forms.
                </li>
                <li>
                  <strong>Project Information:</strong> Architectural briefs, structural drawings, project
                  specifications, or messages you submit for engineering review.
                </li>
                <li>
                  <strong>Technical Browsing Data:</strong> Standard server logs such as IP address,
                  browser type, and referral URLs collected automatically for server stability and security.
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-serif text-[#121418] font-medium tracking-tight">
                3. How We Use Your Information
              </h2>
              <p>Your information is used exclusively for legitimate business and engineering purposes:</p>
              <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-black/75">
                <li>To evaluate, schedule, and respond to your consultation and engineering inquiries.</li>
                <li>To prepare technical proposals, fee estimates, and contractual scopes of work.</li>
                <li>To comply with regulatory standards and professional engineering ethics.</li>
                <li>To maintain the operational security and performance of our digital infrastructure.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-serif text-[#121418] font-medium tracking-tight">
                4. Engineering Confidentiality & IP Protection
              </h2>
              <p>
                We treat all architectural blueprints, structural drawings, proprietary calculations,
                and site data as strictly confidential. Project details are never shared with unauthorized
                third parties without the explicit consent of the client or project owner.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-serif text-[#121418] font-medium tracking-tight">
                5. Third-Party Disclosures & Selling of Data
              </h2>
              <div className="p-5 bg-white border border-black/10 rounded-sm flex items-start gap-4">
                <ShieldCheck className="w-5 h-5 text-[#c47d48] shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-black/80 leading-relaxed">
                  <strong>We do not sell, rent, or trade your personal information.</strong> We do not
                  monetize user data, nor do we disclose client details to third-party marketing brokers
                  or advertising syndicates.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-serif text-[#121418] font-medium tracking-tight">
                6. Cookies & Session Storage
              </h2>
              <p>
                Our public website operates without intrusive third-party advertising trackers. We only
                employ essential, secure session cookies (such as encrypted HTTP-only session tokens for
                authenticated administrative access). These cookies are strictly functional and do not track
                your browsing activities across external websites.
              </p>
            </section>

            {/* Section 7 */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-serif text-[#121418] font-medium tracking-tight">
                7. Data Retention & Your Rights
              </h2>
              <p>
                We retain client inquiries and project correspondence only as long as necessary to fulfill
                professional engineering services and satisfy legal or taxation obligations. You have the
                right to request access to, correction of, or deletion of your contact records at any time.
              </p>
            </section>

            {/* Section 8: Contact */}
            <section className="pt-6 border-t border-black/10 space-y-4">
              <h2 className="text-xl sm:text-2xl font-serif text-[#121418] font-medium tracking-tight">
                8. Contact Our Team
              </h2>
              <p>
                If you have questions regarding this policy or wish to review the information we hold,
                please contact Maple Consulting Engineers:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-white border border-black/10 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-black/50">
                    <Mail className="w-3.5 h-3.5 text-[#c47d48]" />
                    <span>Email</span>
                  </div>
                  <a
                    href={`mailto:${settings?.email || "maplececlt@gmail.com"}`}
                    className="text-xs font-medium text-black hover:text-[#c47d48] break-all block"
                  >
                    {settings?.email || "maplececlt@gmail.com"}
                  </a>
                </div>

                <div className="p-4 bg-white border border-black/10 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-black/50">
                    <Phone className="w-3.5 h-3.5 text-[#c47d48]" />
                    <span>Telephone</span>
                  </div>
                  <a
                    href={`tel:${(settings?.phone || "+917907376219").replace(/\s+/g, "")}`}
                    className="text-xs font-medium text-black hover:text-[#c47d48] block"
                  >
                    {settings?.phone || "+91 7907 37 62 19"}
                  </a>
                </div>

                <div className="p-4 bg-white border border-black/10 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-black/50">
                    <MapPin className="w-3.5 h-3.5 text-[#c47d48]" />
                    <span>Office</span>
                  </div>
                  <p className="text-xs font-medium text-black line-clamp-2">
                    {settings?.address || "Housing colony, Malaparamba, Calicut"}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer settings={settings} services={services} branches={branches} />
    </div>
  );
}
