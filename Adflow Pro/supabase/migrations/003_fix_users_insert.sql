-- ============================================================
-- Fix: Allow trigger to insert into public.users table
-- This fixes the "Database error" on signup
-- ============================================================

-- Add INSERT policy for users table (for trigger function)
CREATE POLICY "users_insert_on_signup" ON public.users 
FOR INSERT 
WITH CHECK (true);

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'users';
