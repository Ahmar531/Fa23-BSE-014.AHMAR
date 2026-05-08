-- ============================================================
-- AdFlow Pro - Moderation System Enhancement
-- Adds moderation tracking fields to ads table
-- ============================================================

-- Add moderation tracking columns to ads table
ALTER TABLE public.ads
ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS review_note TEXT;

-- Create index for reviewed_by for faster queries
CREATE INDEX IF NOT EXISTS idx_ads_reviewed_by ON public.ads(reviewed_by);
CREATE INDEX IF NOT EXISTS idx_ads_reviewed_at ON public.ads(reviewed_at);

-- Create profiles table for additional user metadata (if not exists)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'client',
  disabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies (drop if exists first, then create)
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (id = auth.uid());

DROP POLICY IF EXISTS "profiles_select_staff" ON public.profiles;
CREATE POLICY "profiles_select_staff" ON public.profiles FOR SELECT USING (get_user_role() IN ('admin', 'super_admin', 'moderator'));

DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;
CREATE POLICY "profiles_update_admin" ON public.profiles FOR UPDATE USING (get_user_role() IN ('admin', 'super_admin'));

DROP POLICY IF EXISTS "profiles_insert_admin" ON public.profiles;
CREATE POLICY "profiles_insert_admin" ON public.profiles FOR INSERT WITH CHECK (get_user_role() IN ('admin', 'super_admin'));

-- Create trigger for profiles updated_at (drop if exists first)
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at 
BEFORE UPDATE ON public.profiles 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update RLS policies for moderator review workflow
-- Moderators can update ads from submitted -> under_review or payment_pending
DROP POLICY IF EXISTS "ads_update_moderator" ON public.ads;
CREATE POLICY "ads_update_moderator" ON public.ads
  FOR UPDATE
  USING (
    get_user_role() IN ('moderator', 'admin', 'super_admin')
  )
  WITH CHECK (
    get_user_role() IN ('moderator', 'admin', 'super_admin')
  );

-- Admin can verify payments and schedule ads
DROP POLICY IF EXISTS "ads_update_admin_scheduling" ON public.ads;
CREATE POLICY "ads_update_admin_scheduling" ON public.ads
  FOR UPDATE
  USING (get_user_role() IN ('admin', 'super_admin'))
  WITH CHECK (get_user_role() IN ('admin', 'super_admin'));

-- Create view for moderator review queue
CREATE OR REPLACE VIEW public.v_moderator_review_queue AS
SELECT
  a.id, a.slug, a.title, a.description,
  a.status, a.created_at, a.updated_at,
  a.contact_email, a.contact_phone, a.website_url,
  a.price, a.moderation_notes, a.rejection_reason,
  a.reviewed_by, a.reviewed_at, a.review_note,
  u.full_name AS seller_name, u.email AS seller_email,
  u.is_verified_seller,
  c.name AS category_name,
  ci.name AS city_name,
  p.name AS package_name, p.tier AS package_tier,
  reviewer.full_name AS reviewer_name
FROM public.ads a
JOIN public.users u ON a.user_id = u.id
LEFT JOIN public.categories c ON a.category_id = c.id
LEFT JOIN public.cities ci ON a.city_id = ci.id
LEFT JOIN public.packages p ON a.package_id = p.id
LEFT JOIN public.users reviewer ON a.reviewed_by = reviewer.id
WHERE a.is_deleted = false
ORDER BY a.created_at ASC;

-- Grant permissions
GRANT SELECT ON public.v_moderator_review_queue TO authenticated;
GRANT SELECT ON public.profiles TO authenticated;

-- Insert test accounts (for development/testing)
-- Password for all test accounts: TestPass123!
-- These are hashed with Supabase's default bcrypt

COMMENT ON TABLE public.profiles IS 'Extended user profiles with role and status information';
COMMENT ON COLUMN public.ads.reviewed_by IS 'User ID of moderator/admin who reviewed this ad';
COMMENT ON COLUMN public.ads.reviewed_at IS 'Timestamp when the ad was reviewed';
COMMENT ON COLUMN public.ads.review_note IS 'Internal note from moderator about the review decision';
