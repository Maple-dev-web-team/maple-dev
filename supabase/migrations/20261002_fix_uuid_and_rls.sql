-- ==============================================================================
-- 1. DROP EXISTING CONSTRAINTS AND TABLES (CLEAN SLATE TO ALLOW TEXT/SLUG IDS)
-- ==============================================================================

-- Drop tables in reverse foreign-key order
DROP TABLE IF EXISTS public.social_links CASCADE;
DROP TABLE IF EXISTS public.contact_submissions CASCADE;
DROP TABLE IF EXISTS public.branches CASCADE;
DROP TABLE IF EXISTS public.project_images CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.project_categories CASCADE;
DROP TABLE IF EXISTS public.clients CASCADE;
DROP TABLE IF EXISTS public.team_members CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.homepage_content CASCADE;
DROP TABLE IF EXISTS public.site_settings CASCADE;

-- ==============================================================================
-- 2. CREATE TABLES WITH TEXT PRIMARY KEYS (ACCEPTS BOTH STRING SLUGS & UUIDs)
-- ==============================================================================

-- 1. SITE SETTINGS
CREATE TABLE public.site_settings (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    company_name TEXT NOT NULL DEFAULT 'Maple Consulting Engineers',
    tagline TEXT,
    logo_url TEXT,
    logo_public_id TEXT,
    favicon_url TEXT,
    email TEXT,
    phone TEXT,
    phone_alt TEXT,
    whatsapp TEXT,
    address TEXT,
    google_maps_url TEXT,
    copyright_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. HOMEPAGE CONTENT
CREATE TABLE public.homepage_content (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    hero_eyebrow TEXT,
    hero_title_line1 TEXT,
    hero_title_line2 TEXT,
    hero_description TEXT,
    hero_cta_label TEXT,
    hero_cta_url TEXT,
    hero_image_url TEXT,
    hero_image_public_id TEXT,
    hero_image_2_url TEXT,
    hero_image_2_public_id TEXT,
    hero_image_3_url TEXT,
    hero_image_3_public_id TEXT,
    hero_vertical_text TEXT,
    about_section_number TEXT,
    about_eyebrow TEXT,
    about_title TEXT,
    about_description_1 TEXT,
    about_description_2 TEXT,
    about_cta_label TEXT,
    about_cta_url TEXT,
    about_image_url TEXT,
    about_image_public_id TEXT,
    vision_eyebrow TEXT,
    vision_title TEXT,
    vision_image_url TEXT,
    vision_image_public_id TEXT,
    purpose_eyebrow TEXT,
    purpose_title_line1 TEXT,
    purpose_title_line2 TEXT,
    purpose_tagline TEXT,
    services_section_number TEXT,
    services_eyebrow TEXT,
    services_title TEXT,
    services_tagline TEXT,
    services_image_url TEXT,
    services_image_public_id TEXT,
    services_secondary_image_url TEXT,
    services_secondary_image_public_id TEXT,
    team_section_number TEXT,
    team_eyebrow TEXT,
    team_title TEXT,
    team_quote TEXT,
    team_cta_label TEXT,
    team_cta_url TEXT,
    clients_section_number TEXT,
    clients_eyebrow TEXT,
    clients_title TEXT,
    clients_tagline TEXT,
    projects_section_number TEXT,
    projects_eyebrow TEXT,
    projects_title TEXT,
    projects_description TEXT,
    projects_cta_label TEXT,
    projects_cta_url TEXT,
    contact_section_number TEXT,
    contact_eyebrow TEXT,
    contact_title TEXT,
    contact_highlight_text TEXT,
    contact_image_url TEXT,
    contact_image_public_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SERVICES
CREATE TABLE public.services (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    number_label TEXT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT,
    description TEXT,
    image_url TEXT,
    image_public_id TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TEAM MEMBERS
CREATE TABLE public.team_members (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
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

-- 5. CLIENTS
CREATE TABLE public.clients (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    logo_public_id TEXT,
    website_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PROJECT CATEGORIES
CREATE TABLE public.project_categories (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    cover_image_url TEXT,
    cover_image_public_id TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PROJECTS
CREATE TABLE public.projects (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category_id TEXT REFERENCES public.project_categories(id) ON DELETE SET NULL,
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

-- 8. PROJECT IMAGES
CREATE TABLE public.project_images (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_public_id TEXT,
    alt_text TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. BRANCHES
CREATE TABLE public.branches (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
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

-- 10. CONTACT SUBMISSIONS
CREATE TABLE public.contact_submissions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. SOCIAL LINKS
CREATE TABLE public.social_links (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. DISABLE ROW LEVEL SECURITY ON CMS CONTENT TABLES (FOR SEAMLESS SERVER ACCESS)
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
