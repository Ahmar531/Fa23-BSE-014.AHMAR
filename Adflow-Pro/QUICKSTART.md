# 🚀 Quick Start Guide - Moderator & Admin System

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Run Database Migration
Go to your Supabase Dashboard → SQL Editor and run:
```sql
-- Copy and paste the contents of:
-- supabase/migrations/002_add_moderation_fields.sql
```

### Step 3: Create Test Accounts
```bash
npm run seed:accounts
```

This creates 4 test accounts:
- `client@test.com` - Client
- `moderator@test.com` - Moderator  
- `admin@test.com` - Admin
- `superadmin@test.com` - Super Admin

**Password:** `TestPass123!`

### Step 4: Start the App
```bash
npm run dev
```

### Step 5: Test the System

#### Test Moderator Flow:
1. Open http://localhost:3001/moderator/login
2. Login with `moderator@test.com` / `TestPass123!`
3. View pending ads in the review queue
4. Approve or reject ads

#### Test Admin Flow:
1. Open http://localhost:3001/admin/login
2. Login with `admin@test.com` / `TestPass123!`
3. View dashboard with statistics
4. Manage users and verify payments

## 🎯 What's Included

### ✅ Moderator System
- Dashboard with quick actions
- Pending review queue (uses existing ModeratorReviewPanel)
- Approve/reject workflow
- Review history (approved/rejected)

### ✅ Admin System
- Dashboard with KPIs (existing)
- User management (existing)
- Payment verification (existing)
- Analytics (existing)

### ✅ Security
- Role-based access control
- Middleware protection
- RLS policies
- Audit logging

## 📱 Access URLs

- **Client:** http://localhost:3001/auth/login
- **Moderator:** http://localhost:3001/moderator/login
- **Admin:** http://localhost:3001/admin/login

## 🔐 Test Credentials

All test accounts use password: `TestPass123!`

| Email | Role | Access |
|-------|------|--------|
| client@test.com | Client | Dashboard |
| moderator@test.com | Moderator | Moderator Desk |
| admin@test.com | Admin | Admin Console + Moderator |
| superadmin@test.com | Super Admin | All Portals |

## 🎬 Demo Workflow

### Complete Moderation Flow:

1. **As Client** (client@test.com):
   - Login to http://localhost:3001/auth/login
   - Create a new ad
   - Submit it for review

2. **As Moderator** (moderator@test.com):
   - Login to http://localhost:3001/moderator/login
   - Go to "Pending Review"
   - Review the ad
   - Approve or reject with reason

3. **As Admin** (admin@test.com):
   - Login to http://localhost:3001/admin/login
   - View dashboard statistics
   - Check payment queue
   - Manage users

## 🐛 Troubleshooting

### Can't login?
- Check that test accounts were created: `npm run seed:accounts`
- Verify Supabase credentials in `.env.local`

### "Unauthorized" error?
- Run the database migration
- Check user role in Supabase Dashboard

### No pending ads?
- The seed script creates 3 test ads automatically
- Or create one as client@test.com

## 📚 Full Documentation

See `MODERATOR_ADMIN_SETUP.md` for complete documentation.

## 🎉 You're Ready!

The system is now fully functional with:
- ✅ Secure authentication
- ✅ Role-based access
- ✅ Moderation workflow
- ✅ Admin dashboard
- ✅ Test accounts

Start testing and customize as needed!
