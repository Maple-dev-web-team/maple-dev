export interface SiteSettings {
  id: string;
  company_name: string;
  tagline: string | null;
  logo_url: string | null;
  logo_public_id: string | null;
  favicon_url: string | null;
  email: string | null;
  phone: string | null;
  phone_alt: string | null;
  whatsapp: string | null;
  address: string | null;
  google_maps_url: string | null;
  copyright_text: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface HomepageContent {
  id: string;
  hero_eyebrow: string | null;
  hero_title_line1: string | null;
  hero_title_line2: string | null;
  hero_description: string | null;
  hero_cta_label: string | null;
  hero_cta_url: string | null;
  hero_image_url: string | null;
  hero_image_public_id: string | null;
  hero_vertical_text: string | null;
  
  about_section_number: string | null;
  about_eyebrow: string | null;
  about_title: string | null;
  about_description_1: string | null;
  about_description_2: string | null;
  about_cta_label: string | null;
  about_cta_url: string | null;
  about_image_url: string | null;
  about_image_public_id: string | null;

  vision_eyebrow: string | null;
  vision_title: string | null;
  vision_image_url: string | null;
  vision_image_public_id: string | null;
  purpose_eyebrow: string | null;
  purpose_title_line1: string | null;
  purpose_title_line2: string | null;
  purpose_tagline: string | null;

  services_section_number: string | null;
  services_eyebrow: string | null;
  services_title: string | null;
  services_tagline: string | null;
  services_image_url: string | null;
  services_image_public_id: string | null;
  services_secondary_image_url: string | null;
  services_secondary_image_public_id: string | null;

  team_section_number: string | null;
  team_eyebrow: string | null;
  team_title: string | null;
  team_quote: string | null;
  team_cta_label: string | null;
  team_cta_url: string | null;

  clients_section_number: string | null;
  clients_eyebrow: string | null;
  clients_title: string | null;
  clients_tagline: string | null;

  projects_section_number: string | null;
  projects_eyebrow: string | null;
  projects_title: string | null;
  projects_description: string | null;
  projects_cta_label: string | null;
  projects_cta_url: string | null;

  contact_section_number: string | null;
  contact_eyebrow: string | null;
  contact_title: string | null;
  contact_highlight_text: string | null;
  contact_image_url: string | null;
  contact_image_public_id: string | null;

  created_at?: string;
  updated_at?: string;
}

export interface Service {
  id: string;
  number_label: string | null;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  image_public_id: string | null;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  designation: string;
  qualification: string | null;
  bio: string | null;
  image_url: string | null;
  image_public_id: string | null;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Client {
  id: string;
  name: string;
  logo_url: string;
  logo_public_id: string | null;
  website_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  cover_image_public_id: string | null;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category_id: string | null;
  short_description: string | null;
  description: string | null;
  location: string | null;
  completion_year: string | null;
  client_name: string | null;
  scope_of_work: string | null;
  cover_image_url: string | null;
  cover_image_public_id: string | null;
  display_order: number;
  is_featured: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  // Joined relations
  category?: ProjectCategory | null;
  images?: ProjectImage[];
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  image_public_id: string | null;
  alt_text: string | null;
  display_order: number;
  created_at?: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  map_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  created_at?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}
