# Setup Test Accounts - Step by Step Guide

Follow these steps to create test accounts for all roles.

## Step 1: Register Test Accounts

Go to `http://localhost:3001/auth/register` and register these accounts:

### Account 1: Client
- Full Name: `Test Client`
- Email: `client@adflow.test`
- Password: `Client123!`

### Account 2: Moderator
- Full Name: `Test Moderator`
- Email: `moderator@adflow.test`
- Password: `Moderator123!`

### Account 3: Admin
- Full Name: `Test Admin`
- Email: `admin@adflow.test`
- Password: `Admin123!`

### Account 4: Super Admin
- Full Name: `Test Super Admin`
- Email: `superadmin@adflow.test`
- Password: `SuperAdmin123!`

---

## Step 2: Update Roles in Supabase

After registering all accounts, go to your Supabase Dashboard:

1. Open **SQL Editor**
2. Create a new query
3. Copy and paste this SQL:

```sql
-- Update roles for test accounts
-- Client role is already 'client' by default, no update needed

-- Update Moderator
UPDATE public.users 
SET role = 'moderator' 
WHERE email = 'moderator@adflow.test';

-- Update Admin
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'admin@adflow.test';

-- Update Super Admin
UPDATE public.users 
SET role = 'super_admin' 
WHERE email = 'superadmin@adflow.test';

-- Verify the updates
SELECT email, full_name, role, created_at 
FROM public.users 
WHERE email IN (
  'client@adflow.test',
  'moderator@adflow.test', 
  'admin@adflow.test',
  'superadmin@adflow.test'
)
ORDER BY role;
```

4. Click **Run** button
5. You should see 3 rows updated (client is already correct)
6. The SELECT query will show all accounts with their roles

---

## Step 3: Test Each Account

### Test Client Account
1. Logout from current account
2. Login with: `client@adflow.test` / `Client123!`
3. You should see `/dashboard`
4. Try creating an ad at `/dashboard/ads/create`

### Test Moderator Account
1. Logout
2. Login with: `moderator@adflow.test` / `Moderator123!`
3. You should see `/moderator` in navigation
4. Go to `/moderator` to see review queue

### Test Admin Account
1. Logout
2. Login with: `admin@adflow.test` / `Admin123!`
3. You should see `/admin` in navigation
4. Go to `/admin` to see payment verification

### Test Super Admin Account
1. Logout
2. Login with: `superadmin@adflow.test` / `SuperAdmin123!`
3. You should see `/super-admin` in navigation
4. Go to `/super-admin` to manage system settings

---

## Quick Reference

| Role | Email | Password | Access |
|------|-------|----------|--------|
| Client | client@adflow.test | Client123! | Create ads, submit for review |
| Moderator | moderator@adflow.test | Moderator123! | Review and approve ads |
| Admin | admin@adflow.test | Admin123! | Verify payments, publish ads |
| Super Admin | superadmin@adflow.test | SuperAdmin123! | Full system access |

---

## Troubleshooting

### "Email already registered"
- The account already exists
- Just login with that email
- Then update role in Supabase

### "User not found after SQL update"
- Make sure you registered through the app first
- Supabase Auth creates the user, then trigger creates entry in public.users
- Check if user exists: `SELECT * FROM public.users WHERE email = 'your@email.test'`

### "Role not changing"
- Clear browser cache and cookies
- Logout completely
- Login again
- Check middleware is working: see `middleware.ts`

### "Cannot access admin/moderator pages"
- Verify role in database: `SELECT email, role FROM public.users WHERE email = 'your@email.test'`
- Check if middleware is blocking: see console logs
- Make sure you're logged in with correct account

---

## Next Steps

After setup is complete:
1. Keep `TEST_ACCOUNTS.md` for reference
2. Delete this setup file if you want
3. Start testing the complete workflow
4. Create sample ads, approve them, verify payments

Happy testing! 🚀
