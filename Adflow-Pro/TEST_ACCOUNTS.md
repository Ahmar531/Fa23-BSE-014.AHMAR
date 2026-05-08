# Test Accounts for AdFlow Pro

Use these accounts to test different user roles in the system.

## 🔵 Client Account
**Email:** `client@adflow.test`  
**Password:** `Client123!`  
**Role:** Client  
**Access:** Can create ads, submit for review, make payments

---

## 🟢 Moderator Account
**Email:** `moderator@adflow.test`  
**Password:** `Moderator123!`  
**Role:** Moderator  
**Access:** Can review and approve/reject ads

---

## 🟠 Admin Account
**Email:** `admin@adflow.test`  
**Password:** `Admin123!`  
**Role:** Admin  
**Access:** Can verify payments, publish ads, view analytics

---

## 🔴 Super Admin Account
**Email:** `superadmin@adflow.test`  
**Password:** `SuperAdmin123!`  
**Role:** Super Admin  
**Access:** Full system access - manage packages, categories, cities

---

## Quick Setup Instructions

### Option 1: Manual Registration (Recommended)
1. Go to `/auth/register`
2. Register with the emails above
3. After registration, update the role in Supabase:
   - Open Supabase Dashboard
   - Go to Table Editor → `users` table
   - Find the user by email
   - Update the `role` column to: `client`, `moderator`, `admin`, or `super_admin`

### Option 2: Direct SQL Insert
Run this in Supabase SQL Editor:

```sql
-- Note: You need to register these users first through the app
-- Then run this to update their roles:

UPDATE public.users 
SET role = 'moderator' 
WHERE email = 'moderator@adflow.test';

UPDATE public.users 
SET role = 'admin' 
WHERE email = 'admin@adflow.test';

UPDATE public.users 
SET role = 'super_admin' 
WHERE email = 'superadmin@adflow.test';

-- Client role is default, no update needed
```

---

## Testing Workflow

### As Client:
1. Login with client account
2. Create a new ad at `/dashboard/ads/create`
3. Submit for review
4. Wait for moderator approval
5. Submit payment proof
6. Wait for admin verification

### As Moderator:
1. Login with moderator account
2. Go to `/moderator`
3. Review pending ads
4. Approve or reject with notes

### As Admin:
1. Login with admin account
2. Go to `/admin`
3. Verify payments
4. Publish approved ads
5. View analytics

### As Super Admin:
1. Login with super admin account
2. Go to `/super-admin`
3. Manage packages, categories, cities
4. Full system control

---

## Current Login
Your current account: `a03480748044@gmail.com`  
To use test accounts, logout and login with accounts above.

---

## Security Note
⚠️ These are TEST accounts only. Do NOT use in production!  
Change passwords and use real emails in production environment.
