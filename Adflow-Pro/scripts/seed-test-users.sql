-- Seed Test Users SQL Script
-- Run this in Supabase SQL Editor AFTER registering users through the app

-- First, verify which users exist
SELECT email, full_name, role, created_at 
FROM public.users 
WHERE email LIKE '%@adflow.test'
ORDER BY email;

-- Update roles for test accounts
-- (Run this after registering the accounts through /auth/register)

-- Update Moderator role
UPDATE public.users 
SET role = 'moderator',
    updated_at = NOW()
WHERE email = 'moderator@adflow.test';

-- Update Admin role
UPDATE public.users 
SET role = 'admin',
    updated_at = NOW()
WHERE email = 'admin@adflow.test';

-- Update Super Admin role
UPDATE public.users 
SET role = 'super_admin',
    updated_at = NOW()
WHERE email = 'superadmin@adflow.test';

-- Verify the updates
SELECT 
    email, 
    full_name, 
    role, 
    created_at,
    updated_at
FROM public.users 
WHERE email IN (
    'client@adflow.test',
    'moderator@adflow.test', 
    'admin@adflow.test',
    'superadmin@adflow.test'
)
ORDER BY 
    CASE role
        WHEN 'client' THEN 1
        WHEN 'moderator' THEN 2
        WHEN 'admin' THEN 3
        WHEN 'super_admin' THEN 4
    END;

-- Expected output:
-- client@adflow.test       | Test Client       | client      
-- moderator@adflow.test    | Test Moderator    | moderator   
-- admin@adflow.test        | Test Admin        | admin       
-- superadmin@adflow.test   | Test Super Admin  | super_admin
