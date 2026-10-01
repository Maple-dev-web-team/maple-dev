import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { AboutSection } from "@/components/home/AboutSection";
import { VisionSection } from "@/components/home/VisionSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { TeamSection } from "@/components/home/TeamSection";
import { ClientsSection } from "@/components/home/ClientsSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { ContactCTA } from "@/components/home/ContactCTA";
import {
  getSiteSettings,
  getHomepageContent,
  getServices,
  getTeamMembers,
  getClients,
  getProjectCategories,
  getProjects,
  getBranches,
} from "@/lib/queries";

// Always fetch dynamic CMS updates instantly
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [
    settings,
    homepageContent,
    services,
    team,
    clients,
    categories,
    projects,
    branches,
  ] = await Promise.all([
    getSiteSettings(),
    getHomepageContent(),
    getServices(),
    getTeamMembers(),
    getClients(),
    getProjectCategories(),
    getProjects({ limit: 6 }),
    getBranches(),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f6f2]">
      <Header settings={settings} />
      <main className="flex-1">
        <Hero content={homepageContent} />
        <AboutSection content={homepageContent} />
        <VisionSection content={homepageContent} />
        <ServicesSection content={homepageContent} services={services} />
        <TeamSection content={homepageContent} team={team} />
        <ClientsSection content={homepageContent} clients={clients} />
        <ProjectsSection
          content={homepageContent}
          projects={projects}
          categories={categories}
        />
        <ContactCTA
          content={homepageContent}
          settings={settings}
          branches={branches}
        />
      </main>
      <Footer
        settings={settings}
        services={services}
        branches={branches}
      />
    </div>
  );
}
