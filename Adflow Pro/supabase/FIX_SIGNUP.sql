-- ============================================================
-- COMPLETE FIX FOR SIGNUP DATABASE ERROR
-- Copy this entire file and run in Supabase SQL Editor
-- ============================================================

-- Step 1: Drop existing trigger if any
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 2: Recreate the function with proper error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'client'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Step 3: Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 4: Add INSERT policy for users table
DROP POLICY IF EXISTS "users_insert_on_signup" ON public.users;
CREATE POLICY "users_insert_on_signup" 
ON public.users 
FOR INSERT 
WITH CHECK (true);

-- Step 5: Verify everything is set up
SELECT 
  'Trigger exists' as check_name,
  COUNT(*) as count
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created'
UNION ALL
SELECT 
  'Insert policy exists',
  COUNT(*)
FROM pg_policies 
WHERE tablename = 'users' AND policyname = 'users_insert_on_signup';

-- ============================================================
-- If you see count = 1 for both, everything is set up correctly!
-- Now try signup again at http://localhost:3000/auth/register
-- ============================================================
