-- Add additional banner slots for hero auto-slide carousel
ALTER TABLE public.homepage_content
ADD COLUMN IF NOT EXISTS hero_image_2_url TEXT,
ADD COLUMN IF NOT EXISTS hero_image_2_public_id TEXT,
ADD COLUMN IF NOT EXISTS hero_image_3_url TEXT,
ADD COLUMN IF NOT EXISTS hero_image_3_public_id TEXT;
