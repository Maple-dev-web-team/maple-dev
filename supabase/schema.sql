-- ==============================================================================
-- MAPLE CONSULTING ENGINEERS - COMPLETE DATABASE SCHEMA
-- RUN THIS IN SUPABASE SQL EDITOR TO INITIALIZE YOUR ENTIRE DATABASE
-- ==============================================================================

-- Enable UUID extension
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
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
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
    hero_eyebrow TEXT DEFAULT 'ENGINEERING\nPEOPLE\nPLACES\nBETTER TOMORROW',
    hero_title_line1 TEXT DEFAULT 'delivering',
    hero_title_line2 TEXT DEFAULT 'EXCELLENCE',
    hero_description TEXT DEFAULT 'Every project is an opportunity to build upon our reputation for quality, creativity, and strong relationships.',
    hero_cta_label TEXT DEFAULT 'DISCOVER MAPLE',
    hero_cta_url TEXT DEFAULT '#about',
    hero_image_url TEXT,
    hero_image_public_id TEXT,
    hero_image_2_url TEXT,
    hero_image_2_public_id TEXT,
    hero_image_3_url TEXT,
    hero_image_3_public_id TEXT,
    hero_vertical_text TEXT DEFAULT 'CIVIL & STRUCTURAL ENGINEERING',
    about_section_number TEXT DEFAULT '01',
    about_eyebrow TEXT DEFAULT 'ABOUT US',
    about_title TEXT DEFAULT 'Built on experience.\nDriven by possibility.',
    about_description_1 TEXT,
    about_description_2 TEXT,
    about_cta_label TEXT DEFAULT 'MORE ABOUT US',
    about_cta_url TEXT DEFAULT '/about',
    about_image_url TEXT,
    about_image_public_id TEXT,
    vision_eyebrow TEXT DEFAULT 'OUR VISION',
    vision_title TEXT DEFAULT 'Shaping A\nBetter World',
    vision_image_url TEXT,
    vision_image_public_id TEXT,
    purpose_eyebrow TEXT DEFAULT 'OUR PURPOSE',
    purpose_title_line1 TEXT DEFAULT 'NURTURING',
    purpose_title_line2 TEXT DEFAULT 'GROWTH',
    purpose_tagline TEXT DEFAULT 'PEOPLE STRUCTURED COMMUNITIES A RENOWNED TOMORROW',
    services_section_number TEXT DEFAULT '02',
    services_eyebrow TEXT DEFAULT 'SERVICES',
    services_title TEXT DEFAULT 'What we do.',
    services_tagline TEXT DEFAULT 'IDEAS STRUCTURES EXECUTING FOR A BETTER TOMORROW',
    services_image_url TEXT,
    services_image_public_id TEXT,
    services_secondary_image_url TEXT,
    services_secondary_image_public_id TEXT,
    team_section_number TEXT DEFAULT '03',
    team_eyebrow TEXT DEFAULT 'TEAM',
    team_title TEXT DEFAULT 'Our people\nare our company.',
    team_quote TEXT DEFAULT 'Expertise becomes meaningful when it is shared.',
    team_cta_label TEXT DEFAULT 'MEET OUR TEAM',
    team_cta_url TEXT DEFAULT '/team',
    clients_section_number TEXT DEFAULT '04',
    clients_eyebrow TEXT DEFAULT 'CLIENTS',
    clients_title TEXT DEFAULT 'Our clients are our growth.',
    clients_tagline TEXT DEFAULT 'TRUSTED COLLABORATIONS\nLONG TERM RELATIONSHIPS',
    projects_section_number TEXT DEFAULT '05',
    projects_eyebrow TEXT DEFAULT 'PROJECTS',
    projects_title TEXT DEFAULT 'Every Project is Unique',
    projects_description TEXT DEFAULT 'We approach every design challenge with a passion for solving problems. Our goal is to provide good quality works and services in everything we do.',
    projects_cta_label TEXT DEFAULT 'VIEW ALL PROJECTS',
    projects_cta_url TEXT DEFAULT '/projects',
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
-- INDEXES
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
-- TRIGGERS
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
ALTER TABLE public.site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links DISABLE ROW LEVEL SECURITY;

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

CREATE POLICY "open_site_settings" ON public.site_settings FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "open_homepage_content" ON public.homepage_content FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "open_services" ON public.services FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "open_team_members" ON public.team_members FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "open_clients" ON public.clients FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "open_project_categories" ON public.project_categories FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "open_projects" ON public.projects FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "open_project_images" ON public.project_images FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "open_branches" ON public.branches FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "open_contact_submissions" ON public.contact_submissions FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "open_social_links" ON public.social_links FOR ALL TO public USING (true) WITH CHECK (true);

-- ==============================================================================
-- INITIAL DEFAULT RECORDS (IF EMPTY)
-- ==============================================================================
INSERT INTO public.site_settings (
    company_name,
    tagline,
    email,
    phone,
    phone_alt,
    whatsapp,
    address,
    copyright_text
)
SELECT
    'Maple Consulting Engineers',
    'Civil & Structural Engineering Consultancy',
    'maplececlt@gmail.com',
    '+91 8281 33 44 35',
    '+91 9946 62 50 63',
    '+91 8281 33 44 35',
    'Near Popular Vehicle Showroom, Meleparamba, Calicut',
    '© 2026 Maple Consulting Engineers. All rights reserved.'
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings);

INSERT INTO public.homepage_content (
    hero_eyebrow,
    hero_title_line1,
    hero_title_line2,
    hero_description,
    hero_cta_label,
    hero_cta_url,
    hero_vertical_text,
    about_section_number,
    about_eyebrow,
    about_title,
    about_description_1,
    about_description_2,
    about_cta_label,
    about_cta_url,
    vision_eyebrow,
    vision_title,
    purpose_eyebrow,
    purpose_title_line1,
    purpose_title_line2,
    purpose_tagline,
    services_section_number,
    services_eyebrow,
    services_title,
    services_tagline,
    team_section_number,
    team_eyebrow,
    team_title,
    team_quote,
    team_cta_label,
    team_cta_url,
    clients_section_number,
    clients_eyebrow,
    clients_title,
    clients_tagline,
    projects_section_number,
    projects_eyebrow,
    projects_title,
    projects_description,
    projects_cta_label,
    projects_cta_url,
    contact_section_number,
    contact_eyebrow,
    contact_title,
    contact_highlight_text
)
SELECT
    E'ENGINEERING\nPEOPLE\nPLACES\nBETTER TOMORROW',
    'delivering',
    'EXCELLENCE',
    'Every project is an opportunity to build upon our reputation for quality, creativity, and strong relationships.',
    'DISCOVER MAPLE',
    '#about',
    'CIVIL & STRUCTURAL ENGINEERING',
    '01',
    'ABOUT US',
    E'Built on experience.\nDriven by possibility.',
    'Maple consulting engineers are a Civil and Structural Engineering consultancy offering a nationwide service to our clients. Our experience and expertise allow us to offer a range of specialist services, all integrated to serve the needs and requirements of clients in the sectors in which we operate. We provide innovative structural design and analysis services to architects, owners, and developers for all types of buildings at all project phases.',
    'Maple consulting engineers undertakes a wide variety of work, ranging from major new build schemes through to complex renovation projects across the market sectors in which we operate. We are involved in consulting projects across both the public and private sectors.',
    'MORE ABOUT US',
    '#contact',
    'OUR VISION',
    E'Shaping A\nBetter World',
    'OUR PURPOSE',
    'NURTURING',
    'GROWTH',
    'PEOPLE STRUCTURED COMMUNITIES A RENOWNED TOMORROW',
    '02',
    'SERVICES',
    'What we do.',
    'IDEAS STRUCTURES EXECUTING FOR A BETTER TOMORROW',
    '03',
    'TEAM',
    E'Our people\nare our company.',
    'Expertise becomes meaningful when it is shared.',
    'MEET OUR TEAM',
    '#team',
    '04',
    'CLIENTS',
    'Our clients are our growth.',
    E'TRUSTED COLLABORATIONS\nLONG TERM RELATIONSHIPS',
    '05',
    'PROJECTS',
    'Every Project is Unique',
    'We approach every design challenge with a passion for solving problems. Our goal is to provide good quality works and services in everything we do.',
    'VIEW ALL PROJECTS',
    '/projects',
    '06',
    'CONTACT',
    E'We are looking\nforward to the future.',
    E'Wherever!\nWhenever!\nTogether with you.'
WHERE NOT EXISTS (SELECT 1 FROM public.homepage_content);
