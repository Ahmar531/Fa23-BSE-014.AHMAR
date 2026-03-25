-- ============================================================
-- DISABLE EMAIL CONFIRMATION (For Development)
-- This allows users to login immediately without email verification
-- ============================================================

-- Note: This is a Supabase setting, not a SQL command
-- You need to do this in Supabase Dashboard:

-- 1. Go to: Authentication → Settings → Email Auth
-- 2. Find: "Enable email confirmations"
-- 3. Toggle it OFF (disable)
-- 4. Click Save

-- After this, users can signup and login immediately without email verification!

-- ============================================================
-- Alternative: Auto-confirm users via SQL (if needed)
-- ============================================================

-- If you already have users that need confirmation, run this:
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;
