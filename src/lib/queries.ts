import { publicSupabase } from "@/lib/supabase/public";
import fs from "fs";
import path from "path";
import type {
  SiteSettings,
  HomepageContent,
  Service,
  TeamMember,
  Client,
  ProjectCategory,
  Project,
  Branch,
  SocialLink,
} from "@/types/database";

// Helper to load fallback content from data/content.json
function getLocalFallback() {
  try {
    const filePath = path.join(process.cwd(), "data", "content.json");
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(fileData);
    }
  } catch (err) {
    console.warn("Could not read local content.json:", err);
  }
  return {};
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const fallback = getLocalFallback().site_settings || {};
  try {
    const { data, error } = await publicSupabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      return {
        ...fallback,
        ...data,
        logo_url: data.logo_url || fallback.logo_url || null,
      };
    }
  } catch {
    // fallback
  }
  return fallback;
}

export async function getHomepageContent(): Promise<HomepageContent | null> {
  const fallback = getLocalFallback().homepage_content || {};
  try {
    const { data, error } = await publicSupabase
      .from("homepage_content")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      // Merge smartly so images saved locally or in Supabase are never lost
      return {
        ...fallback,
        ...data,
        hero_image_url: data.hero_image_url || fallback.hero_image_url || null,
        hero_image_public_id:
          data.hero_image_public_id || fallback.hero_image_public_id || null,
        about_image_url: data.about_image_url || fallback.about_image_url || null,
        about_image_public_id:
          data.about_image_public_id || fallback.about_image_public_id || null,
        vision_image_url: data.vision_image_url || fallback.vision_image_url || null,
        vision_image_public_id:
          data.vision_image_public_id || fallback.vision_image_public_id || null,
        services_image_url:
          data.services_image_url || fallback.services_image_url || null,
        services_image_public_id:
          data.services_image_public_id || fallback.services_image_public_id || null,
        services_secondary_image_url:
          data.services_secondary_image_url ||
          fallback.services_secondary_image_url ||
          null,
        services_secondary_image_public_id:
          data.services_secondary_image_public_id ||
          fallback.services_secondary_image_public_id ||
          null,
        contact_image_url: data.contact_image_url || fallback.contact_image_url || null,
        contact_image_public_id:
          data.contact_image_public_id || fallback.contact_image_public_id || null,
      };
    }
  } catch {
    // fallback
  }
  return fallback;
}

export async function getServices(): Promise<Service[]> {
  try {
    const { data, error } = await publicSupabase
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      const fallback = getLocalFallback();
      return fallback.services || [];
    }
    return data;
  } catch {
    const fallback = getLocalFallback();
    return fallback.services || [];
  }
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const fallback = getLocalFallback().team_members || [];
  try {
    const { data, error } = await publicSupabase
      .from("team_members")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (!error && data && data.length > 0) {
      return (data as TeamMember[]).map((m) => {
        const local = fallback.find((l: TeamMember) => l.id === m.id || l.slug === m.slug);
        return {
          ...local,
          ...m,
          photo_url: m.photo_url || local?.photo_url || null,
        };
      });
    }
  } catch {
    // fallback
  }
  return fallback;
}

export async function getClients(): Promise<Client[]> {
  const fallback = getLocalFallback().clients || [];
  try {
    const { data, error } = await publicSupabase
      .from("clients")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (!error && data && data.length > 0) {
      return (data as Client[]).map((c) => {
        const local = fallback.find((l: Client) => l.id === c.id || l.slug === c.slug);
        return {
          ...local,
          ...c,
          logo_url: c.logo_url || local?.logo_url || null,
        };
      });
    }
  } catch {
    // fallback
  }
  return fallback;
}

export async function getProjectCategories(): Promise<ProjectCategory[]> {
  const fallback = getLocalFallback().project_categories || [];
  try {
    const { data, error } = await publicSupabase
      .from("project_categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (!error && data && data.length > 0) {
      return (data as ProjectCategory[]).map((c) => {
        const local = fallback.find((l: ProjectCategory) => l.id === c.id || l.slug === c.slug);
        return {
          ...local,
          ...c,
          cover_image_url: c.cover_image_url || local?.cover_image_url || null,
          cover_image_public_id: c.cover_image_public_id || local?.cover_image_public_id || null,
        };
      });
    }
  } catch {
    // fallback
  }
  return fallback;
}

export async function getProjects(options?: {
  limit?: number;
  categorySlug?: string;
  featuredOnly?: boolean;
}): Promise<Project[]> {
  const fallback = getLocalFallback();
  const localProjects: Project[] = fallback.projects || [];
  const cats: ProjectCategory[] = fallback.project_categories || [];

  try {
    let query = publicSupabase
      .from("projects")
      .select("*, category:project_categories(*)")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (options?.featuredOnly) {
      query = query.eq("is_featured", true);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      const merged = (data as unknown as Project[]).map((p) => {
        const local = localProjects.find((l) => l.id === p.id || l.slug === p.slug);
        return {
          ...local,
          ...p,
          cover_image_url: p.cover_image_url || local?.cover_image_url || null,
          cover_image_public_id: p.cover_image_public_id || local?.cover_image_public_id || null,
        };
      });

      if (options?.categorySlug) {
        return merged.filter((p) => p.category?.slug === options.categorySlug);
      }
      return merged;
    }
  } catch {
    // fallback
  }

  const populated = localProjects.map((p) => ({
    ...p,
    category: cats.find((c) => c.id === p.category_id) || null,
  }));

  if (options?.categorySlug) {
    return populated.filter((p) => p.category?.slug === options.categorySlug);
  }
  if (options?.limit) {
    return populated.slice(0, options.limit);
  }
  return populated;
}


export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const { data, error } = await publicSupabase
      .from("projects")
      .select("*, category:project_categories(*), images:project_images(*)")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (error || !data) {
      const fallback = getLocalFallback();
      const allProjects: Project[] = fallback.projects || [];
      const cats: ProjectCategory[] = fallback.project_categories || [];
      const match = allProjects.find((p) => p.slug === slug);
      if (match) {
        return {
          ...match,
          category: cats.find((c) => c.id === match.category_id) || null,
          images: [],
        };
      }
      return null;
    }
    return data as unknown as Project;
  } catch {
    return null;
  }
}

export async function getBranches(): Promise<Branch[]> {
  try {
    const { data, error } = await publicSupabase
      .from("branches")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      const fallback = getLocalFallback();
      return fallback.branches || [];
    }
    return data;
  } catch {
    const fallback = getLocalFallback();
    return fallback.branches || [];
  }
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  try {
    const { data, error } = await publicSupabase
      .from("social_links")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return [];
    }
    return data;
  } catch {
    return [];
  }
}
