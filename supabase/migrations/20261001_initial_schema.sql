-- ==============================================================================
-- MAPLE CONSULTING ENGINEERS - DATABASE SCHEMA & RLS POLICIES
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL DEFAULT 'Maple Consulting Engineers',
    tagline TEXT DEFAULT 'Civil & Structural Engineering Consultancy',
    logo_url TEXT,
    logo_public_id TEXT,
    favicon_url TEXT,
    email TEXT DEFAULT 'maplececlt@gmail.com',
    phone TEXT DEFAULT '+91 8281 33 44 35',
    phone_alt TEXT DEFAULT '+91 9946 62 50 63',
    whatsapp TEXT DEFAULT '+91 8281 33 44 35',
    address TEXT DEFAULT 'Near Popular Vehicle Showroom, Meleparamba, Calicut',
    google_maps_url TEXT,
    copyright_text TEXT DEFAULT '© 2026 Maple Consulting Engineers. All rights reserved.',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. HOMEPAGE CONTENT TABLE
CREATE TABLE IF NOT EXISTS public.homepage_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Hero Section
    hero_eyebrow TEXT DEFAULT 'ENGINEERING\nPEOPLE\nPLACES\nBETTER TOMORROW',
    hero_title_line1 TEXT DEFAULT 'delivering',
    hero_title_line2 TEXT DEFAULT 'EXCELLENCE',
    hero_description TEXT DEFAULT 'Every project is an opportunity to build upon our reputation for quality, creativity, and strong relationships.',
    hero_cta_label TEXT DEFAULT 'DISCOVER MAPLE',
    hero_cta_url TEXT DEFAULT '#about',
    hero_image_url TEXT,
    hero_image_public_id TEXT,
    hero_vertical_text TEXT DEFAULT 'CIVIL & STRUCTURAL ENGINEERING',
    -- About Section
    about_section_number TEXT DEFAULT '01',
    about_eyebrow TEXT DEFAULT 'ABOUT US',
    about_title TEXT DEFAULT 'Built on experience.\nDriven by possibility.',
    about_description_1 TEXT,
    about_description_2 TEXT,
    about_cta_label TEXT DEFAULT 'MORE ABOUT US',
    about_cta_url TEXT DEFAULT '/about',
    about_image_url TEXT,
    about_image_public_id TEXT,
    -- Vision & Purpose Section
    vision_eyebrow TEXT DEFAULT 'OUR VISION',
    vision_title TEXT DEFAULT 'Shaping A\nBetter World',
    vision_image_url TEXT,
    vision_image_public_id TEXT,
    purpose_eyebrow TEXT DEFAULT 'OUR PURPOSE',
    purpose_title_line1 TEXT DEFAULT 'NURTURING',
    purpose_title_line2 TEXT DEFAULT 'GROWTH',
    purpose_tagline TEXT DEFAULT 'PEOPLE STRUCTURED COMMUNITIES A RENOWNED TOMORROW',
    -- Services Section Meta
    services_section_number TEXT DEFAULT '02',
    services_eyebrow TEXT DEFAULT 'SERVICES',
    services_title TEXT DEFAULT 'What we do.',
    services_tagline TEXT DEFAULT 'IDEAS STRUCTURES EXECUTING FOR A BETTER TOMORROW',
    services_image_url TEXT,
    services_image_public_id TEXT,
    services_secondary_image_url TEXT,
    services_secondary_image_public_id TEXT,
    -- Team Section Meta
    team_section_number TEXT DEFAULT '03',
    team_eyebrow TEXT DEFAULT 'TEAM',
    team_title TEXT DEFAULT 'Our people\nare our company.',
    team_quote TEXT DEFAULT 'Expertise becomes meaningful when it is shared.',
    team_cta_label TEXT DEFAULT 'MEET OUR TEAM',
    team_cta_url TEXT DEFAULT '/team',
    -- Clients Section Meta
    clients_section_number TEXT DEFAULT '04',
    clients_eyebrow TEXT DEFAULT 'CLIENTS',
    clients_title TEXT DEFAULT 'Our clients are our growth.',
    clients_tagline TEXT DEFAULT 'TRUSTED COLLABORATIONS\nLONG TERM RELATIONSHIPS',
    -- Projects Section Meta
    projects_section_number TEXT DEFAULT '05',
    projects_eyebrow TEXT DEFAULT 'PROJECTS',
    projects_title TEXT DEFAULT 'Every Project is Unique',
    projects_description TEXT DEFAULT 'We approach every design challenge with a passion for solving problems. Our goal is to provide good quality works and services in everything we do.',
    projects_cta_label TEXT DEFAULT 'VIEW ALL PROJECTS',
    projects_cta_url TEXT DEFAULT '/projects',
    -- Contact Section Meta
    contact_section_number TEXT DEFAULT '06',
    contact_eyebrow TEXT DEFAULT 'CONTACT',
    contact_title TEXT DEFAULT 'We are looking\nforward to the future.',
    contact_highlight_text TEXT DEFAULT 'Wherever!\nWhenever!\nTogether with you.',
    contact_image_url TEXT,
    contact_image_public_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    number_label TEXT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT,
    description TEXT,
    image_url TEXT,
    image_public_id TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TEAM MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    designation TEXT NOT NULL,
    qualification TEXT,
    bio TEXT,
    image_url TEXT,
    image_public_id TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CLIENTS TABLE
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    logo_public_id TEXT,
    website_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PROJECT CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.project_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    cover_image_public_id TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category_id UUID REFERENCES public.project_categories(id) ON DELETE SET NULL,
    short_description TEXT,
    description TEXT,
    location TEXT,
    completion_year TEXT,
    client_name TEXT,
    scope_of_work TEXT,
    cover_image_url TEXT,
    cover_image_public_id TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PROJECT IMAGES TABLE (GALLERY)
CREATE TABLE IF NOT EXISTS public.project_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_public_id TEXT,
    alt_text TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. BRANCHES TABLE
CREATE TABLE IF NOT EXISTS public.branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    email TEXT,
    map_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. CONTACT SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. SOCIAL LINKS TABLE
CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_services_order ON public.services(display_order) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_team_order ON public.team_members(display_order) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_clients_order ON public.clients(display_order) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_categories_order ON public.project_categories(display_order) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_projects_order ON public.projects(display_order) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category_id);
CREATE INDEX IF NOT EXISTS idx_project_images_project ON public.project_images(project_id, display_order);
CREATE INDEX IF NOT EXISTS idx_branches_order ON public.branches(display_order) WHERE is_active = true;

-- ==============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ==============================================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_site_settings_updated_at') THEN
        CREATE TRIGGER trg_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_homepage_content_updated_at') THEN
        CREATE TRIGGER trg_homepage_content_updated_at BEFORE UPDATE ON public.homepage_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_services_updated_at') THEN
        CREATE TRIGGER trg_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_team_members_updated_at') THEN
        CREATE TRIGGER trg_team_members_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_clients_updated_at') THEN
        CREATE TRIGGER trg_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_project_categories_updated_at') THEN
        CREATE TRIGGER trg_project_categories_updated_at BEFORE UPDATE ON public.project_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_projects_updated_at') THEN
        CREATE TRIGGER trg_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_branches_updated_at') THEN
        CREATE TRIGGER trg_branches_updated_at BEFORE UPDATE ON public.branches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- 1. Site Settings Policies
CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage site settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 2. Homepage Content Policies
CREATE POLICY "Public can view homepage content" ON public.homepage_content FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage homepage content" ON public.homepage_content FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. Services Policies
CREATE POLICY "Public can view active services" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated users can manage services" ON public.services FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. Team Members Policies
CREATE POLICY "Public can view active team members" ON public.team_members FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated users can manage team members" ON public.team_members FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. Clients Policies
CREATE POLICY "Public can view active clients" ON public.clients FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated users can manage clients" ON public.clients FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 6. Project Categories Policies
CREATE POLICY "Public can view active categories" ON public.project_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated users can manage categories" ON public.project_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7. Projects Policies
CREATE POLICY "Public can view active projects" ON public.projects FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated users can manage projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 8. Project Images Policies
CREATE POLICY "Public can view project images" ON public.project_images FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_images.project_id AND projects.is_active = true)
);
CREATE POLICY "Authenticated users can manage project images" ON public.project_images FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 9. Branches Policies
CREATE POLICY "Public can view active branches" ON public.branches FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated users can manage branches" ON public.branches FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 10. Contact Submissions Policies
CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can view and manage contact submissions" ON public.contact_submissions FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 11. Social Links Policies
CREATE POLICY "Public can view active social links" ON public.social_links FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated users can manage social links" ON public.social_links FOR ALL TO authenticated USING (true) WITH CHECK (true);
