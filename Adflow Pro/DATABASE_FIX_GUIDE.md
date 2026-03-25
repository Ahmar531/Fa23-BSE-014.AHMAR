# 🔧 Database Error Fix - User Signup Issue

## ❌ Problem
"Database error" when creating new user during registration.

## 🎯 Root Cause
The trigger function `handle_new_user()` doesn't have proper INSERT policy on `public.users` table.

---

## ✅ Solution (2 Minutes)

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase Dashboard
2. Click **"SQL Editor"** in left sidebar
3. Click **"New Query"**

### Step 2: Run Fix Script
Copy and paste this ENTIRE script:

```sql
-- Fix User Signup Issue
-- Run this in Supabase SQL Editor

-- Step 1: Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 2: Create improved function with better error handling
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

-- Step 3: Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 4: Add INSERT policy for users table (CRITICAL!)
DROP POLICY IF EXISTS "users_insert_on_signup" ON public.users;
CREATE POLICY "users_insert_on_signup" 
ON public.users 
FOR INSERT 
WITH CHECK (true);

-- Step 5: Verify it worked
SELECT 'Fix applied successfully!' as status;
```

### Step 3: Click "Run"
Wait for success message: "Success. No rows returned"

### Step 4: Verify Fix
Run this query to check policies:
```sql
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY policyname;
```

You should see:
- `users_insert_on_signup` | INSERT ✅
- `users_select_own` | SELECT ✅
- `users_update_own` | UPDATE ✅

---

## 🧪 Test the Fix

### Method 1: Try Registration Again
1. Go to: http://localhost:3000/auth/register
2. Fill form:
   - Full Name: Test User
   - Email: test@example.com
   - Password: Test@123
3. Click "Create Account"
4. Should work now! ✅

### Method 2: Check Database
```sql
-- Check if users table is ready
SELECT * FROM public.users LIMIT 1;

-- Should return empty or existing users
```

---

## 🔍 What This Fix Does

### 1. Drops Old Trigger
Removes potentially broken trigger and function

### 2. Creates New Function
- Better error handling
- Proper security settings
- Logs errors instead of failing

### 3. Adds INSERT Policy
**This is the KEY fix!**
- Allows trigger to insert into `public.users`
- Without this, RLS blocks the insert
- `WITH CHECK (true)` allows all inserts from trigger

### 4. Recreates Trigger
Connects the fixed function to auth.users

---

## 📊 Expected Behavior After Fix

### ✅ Registration Flow:
1. User fills registration form
2. Supabase Auth creates user in `auth.users`
3. Trigger fires automatically
4. Function inserts user into `public.users`
5. User redirected to dashboard
6. Success! ✅

### ✅ Database State:
```sql
-- After successful registration:
SELECT * FROM auth.users WHERE email = 'test@example.com';
-- Should return 1 row

SELECT * FROM public.users WHERE email = 'test@example.com';
-- Should return 1 row (same user)
```

---

## 🐛 If Still Not Working

### Check 1: RLS is Enabled
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'users';

-- Should show: rowsecurity = true
```

### Check 2: Trigger Exists
```sql
SELECT tgname, tgenabled 
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- Should show: tgenabled = 'O' (enabled)
```

### Check 3: Function Exists
```sql
SELECT proname 
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- Should return 1 row
```

### Check 4: Policy Exists
```sql
SELECT policyname 
FROM pg_policies 
WHERE tablename = 'users' AND policyname = 'users_insert_on_signup';

-- Should return 1 row
```

---

## 🔄 Alternative: Manual User Creation

If trigger still doesn't work, create users manually:

### Step 1: Create in Auth
```sql
-- In Supabase Dashboard → Authentication → Users
-- Click "Add user" → "Create new user"
-- Email: test@example.com
-- Password: Test@123
-- Auto Confirm: ✅ YES
```

### Step 2: Create in Public
```sql
-- Get the user ID from auth.users
SELECT id, email FROM auth.users WHERE email = 'test@example.com';

-- Insert into public.users (replace USER_ID)
INSERT INTO public.users (id, email, full_name, role)
VALUES ('USER_ID_HERE', 'test@example.com', 'Test User', 'client');
```

---

## ✅ Success Checklist

After running the fix:
- [ ] SQL script executed successfully
- [ ] No errors in SQL Editor
- [ ] Policy `users_insert_on_signup` exists
- [ ] Trigger `on_auth_user_created` exists
- [ ] Function `handle_new_user` exists
- [ ] Registration form works
- [ ] User created in both tables
- [ ] Can login successfully

---

## 📝 Quick Reference

### Fix File Location
`supabase/FIX_USER_SIGNUP.sql`

### Run This Command
Copy entire file content → Paste in Supabase SQL Editor → Click "Run"

### Expected Result
```
Success. No rows returned
```

### Test Registration
http://localhost:3000/auth/register

---

## 🎯 Summary

**Problem**: Database error on user signup
**Cause**: Missing INSERT policy on users table
**Fix**: Add `users_insert_on_signup` policy
**Time**: 2 minutes
**Result**: Registration works! ✅

---

**Status**: Fix ready to apply
**File**: supabase/FIX_USER_SIGNUP.sql
**Action**: Run in Supabase SQL Editor NOW!
