-- ============================================================
-- AdFlow Pro - Test Accounts Seeding Script
-- Creates test accounts for all roles with known credentials
-- ============================================================

-- IMPORTANT: These are TEST accounts for development/demo purposes
-- Password for ALL test accounts: TestPass123!
-- 
-- Test Accounts Created:
-- 1. client@test.com - Client role
-- 2. moderator@test.com - Moderator role  
-- 3. admin@test.com - Admin role
-- 4. superadmin@test.com - Super Admin role

-- Note: You need to create these users through Supabase Auth Dashboard or API
-- This script only creates the profile/user records in the database
-- 
-- To create auth users via Supabase Dashboard:
-- 1. Go to Authentication > Users
-- 2. Click "Add user" > "Create new user"
-- 3. Enter email and password (TestPass123!)
-- 4. Copy the generated UUID
-- 5. Update the UUIDs below with the actual auth.users IDs

-- ============================================================
-- STEP 1: Create test users in profiles table
-- Replace these UUIDs with actual auth.users IDs after creating them
-- ============================================================

-- Insert test profiles (will be linked to auth.users)
INSERT INTO public.profiles (id, email, full_name, role, disabled) VALUES
-- Replace these UUIDs with actual ones from auth.users after creation
('00000000-0000-0000-0000-000000000001', 'client@test.com', 'Test Client', 'client', false),
('00000000-0000-0000-0000-000000000002', 'moderator@test.com', 'Test Moderator', 'moderator', false),
('00000000-0000-0000-0000-000000000003', 'admin@test.com', 'Test Admin', 'admin', false),
('00000000-0000-0000-0000-000000000004', 'superadmin@test.com', 'Test Super Admin', 'super_admin', false)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  disabled = EXCLUDED.disabled;

-- ============================================================
-- STEP 2: Create corresponding users table entries
-- ============================================================

INSERT INTO public.users (id, email, full_name, role, is_verified_seller) VALUES
('00000000-0000-0000-0000-000000000001', 'client@test.com', 'Test Client', 'client', false),
('00000000-0000-0000-0000-000000000002', 'moderator@test.com', 'Test Moderator', 'moderator', false),
('00000000-0000-0000-0000-000000000003', 'admin@test.com', 'Test Admin', 'admin', false),
('00000000-0000-0000-0000-000000000004', 'superadmin@test.com', 'Test Super Admin', 'super_admin', false)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role;

-- ============================================================
-- STEP 3: Create some test ads for moderation workflow
-- ============================================================

-- Get a category and city for test ads
DO $$
DECLARE
  test_category_id UUID;
  test_city_id UUID;
  test_package_id UUID;
  test_client_id UUID := '00000000-0000-0000-0000-000000000001';
BEGIN
  -- Get first category
  SELECT id INTO test_category_id FROM public.categories LIMIT 1;
  
  -- Get first city
  SELECT id INTO test_city_id FROM public.cities LIMIT 1;
  
  -- Get basic package
  SELECT id INTO test_package_id FROM public.packages WHERE tier = 'basic' LIMIT 1;
  
  -- Create test ads in different states
  INSERT INTO public.ads (
    slug, title, description, user_id, package_id, category_id, city_id,
    status, contact_email, price
  ) VALUES
  (
    'test-pending-ad-1',
    'Test Pending Ad - Needs Review',
    'This is a test ad in submitted status waiting for moderator review.',
    test_client_id,
    test_package_id,
    test_category_id,
    test_city_id,
    'submitted',
    'client@test.com',
    99.99
  ),
  (
    'test-pending-ad-2',
    'Another Pending Ad for Testing',
    'This is another test ad that needs moderation approval.',
    test_client_id,
    test_package_id,
    test_category_id,
    test_city_id,
    'submitted',
    'client@test.com',
    149.99
  ),
  (
    'test-under-review-ad',
    'Ad Currently Under Review',
    'This ad is being reviewed by a moderator.',
    test_client_id,
    test_package_id,
    test_category_id,
    test_city_id,
    'under_review',
    'client@test.com',
    199.99
  )
  ON CONFLICT (slug) DO NOTHING;
  
END $$;

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Check created profiles
SELECT id, email, full_name, role, disabled FROM public.profiles 
WHERE email LIKE '%@test.com' 
ORDER BY role;

-- Check created users
SELECT id, email, full_name, role FROM public.users 
WHERE email LIKE '%@test.com' 
ORDER BY role;

-- Check test ads
SELECT id, slug, title, status FROM public.ads 
WHERE slug LIKE 'test-%' 
ORDER BY created_at DESC;

-- ============================================================
-- INSTRUCTIONS FOR MANUAL AUTH USER CREATION
-- ============================================================

/*
Since Supabase auth.users can only be created via Auth API or Dashboard:

METHOD 1: Using Supabase Dashboard (Recommended for testing)
1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Click "Add user" button
4. Select "Create new user"
5. Enter email: client@test.com
6. Enter password: TestPass123!
7. Click "Create user"
8. Copy the generated UUID
9. Update the profile and users INSERT statements above with this UUID
10. Repeat for moderator@test.com, admin@test.com, superadmin@test.com

METHOD 2: Using Supabase Auth API (Programmatic)
Run this from your Next.js app or a script:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key
)

const testAccounts = [
  { email: 'client@test.com', password: 'TestPass123!', role: 'client', name: 'Test Client' },
  { email: 'moderator@test.com', password: 'TestPass123!', role: 'moderator', name: 'Test Moderator' },
  { email: 'admin@test.com', password: 'TestPass123!', role: 'admin', name: 'Test Admin' },
  { email: 'superadmin@test.com', password: 'TestPass123!', role: 'super_admin', name: 'Test Super Admin' },
]

for (const account of testAccounts) {
  const { data, error } = await supabase.auth.admin.createUser({
    email: account.email,
    password: account.password,
    email_confirm: true,
    user_metadata: {
      full_name: account.name,
      role: account.role,
    }
  })
  
  if (error) {
    console.error(`Failed to create ${account.email}:`, error)
  } else {
    console.log(`Created ${account.email} with ID: ${data.user.id}`)
    
    // Update profiles and users tables with the actual UUID
    await supabase.from('profiles').upsert({
      id: data.user.id,
      email: account.email,
      full_name: account.name,
      role: account.role,
    })
    
    await supabase.from('users').upsert({
      id: data.user.id,
      email: account.email,
      full_name: account.name,
      role: account.role,
    })
  }
}
```

After creating auth users, the trigger function `handle_new_user()` will automatically
populate the users table. You may still need to update the profiles table manually
or via the script above.
*/

-- ============================================================
-- CLEANUP (if needed)
-- ============================================================

-- To remove test accounts (run this if you need to start over):
/*
DELETE FROM public.ads WHERE slug LIKE 'test-%';
DELETE FROM public.users WHERE email LIKE '%@test.com';
DELETE FROM public.profiles WHERE email LIKE '%@test.com';
-- Note: You'll need to delete auth.users from the Supabase Dashboard
*/
