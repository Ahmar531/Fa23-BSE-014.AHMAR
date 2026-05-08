# 🚀 AdFlow Pro - Moderator & Admin System Setup Guide

## 📋 Overview

This document provides complete setup instructions for the production-ready Moderator Authentication & Admin Dashboard system.

## ✨ Features Implemented

### 🔐 Authentication System
- ✅ Separate login flows for Admin and Moderator portals
- ✅ Role-based access control (RBAC)
- ✅ Middleware protection for all protected routes
- ✅ Magic link and password authentication
- ✅ Secure session management with Supabase Auth

### 👥 Moderator System
- ✅ Moderator dashboard with statistics
- ✅ Pending ads review queue
- ✅ Approve/Reject workflow with reasons
- ✅ Internal review notes
- ✅ Approved ads history
- ✅ Rejected ads history with reasons
- ✅ Real-time notifications to users

### 🎛️ Admin System
- ✅ Admin dashboard with KPIs
- ✅ User management (view, change roles, disable)
- ✅ Payment verification queue
- ✅ Revenue analytics
- ✅ Moderation statistics
- ✅ System health monitoring
- ✅ Audit logging

## 🗄️ Database Schema

### New Tables & Columns

```sql
-- Added to ads table
ALTER TABLE ads ADD COLUMN reviewed_by UUID;
ALTER TABLE ads ADD COLUMN reviewed_at TIMESTAMPTZ;
ALTER TABLE ads ADD COLUMN review_note TEXT;

-- New profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'client',
  disabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Migration Files
1. `supabase/migrations/001_initial_schema.sql` - Base schema
2. `supabase/migrations/002_add_moderation_fields.sql` - Moderation enhancements

## 🚀 Setup Instructions

### 1. Database Migration

Run the migration to add moderation fields:

```bash
# If using Supabase CLI
supabase db push

# Or run the SQL directly in Supabase Dashboard > SQL Editor
# Copy and paste: supabase/migrations/002_add_moderation_fields.sql
```

### 2. Create Test Accounts

#### Option A: Automated Script (Recommended)

```bash
# Install tsx if not already installed
npm install -D tsx

# Run the account creation script
npx tsx scripts/create-test-accounts.ts
```

This creates:
- `client@test.com` - Client role
- `moderator@test.com` - Moderator role
- `admin@test.com` - Admin role
- `superadmin@test.com` - Super Admin role

**Password for all accounts:** `TestPass123!`

#### Option B: Manual Creation via Supabase Dashboard

1. Go to Supabase Dashboard > Authentication > Users
2. Click "Add user" > "Create new user"
3. Enter email and password
4. After creation, update the role in the database:

```sql
-- Update user role
UPDATE users SET role = 'moderator' WHERE email = 'moderator@test.com';
UPDATE users SET role = 'admin' WHERE email = 'admin@test.com';

-- Also update profiles table
INSERT INTO profiles (id, email, full_name, role)
SELECT id, email, full_name, 'moderator'::user_role
FROM users WHERE email = 'moderator@test.com'
ON CONFLICT (id) DO UPDATE SET role = 'moderator';
```

### 3. Environment Variables

Ensure your `.env.local` has:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Start the Application

```bash
npm run dev
```

## 🔗 Access URLs

### Development (localhost:3001)
- **Client Portal:** http://localhost:3001/auth/login
- **Moderator Desk:** http://localhost:3001/moderator/login
- **Admin Console:** http://localhost:3001/admin/login

### Production
- **Client Portal:** https://yourdomain.com/auth/login
- **Moderator Desk:** https://yourdomain.com/moderator/login
- **Admin Console:** https://yourdomain.com/admin/login

## 👤 User Roles & Permissions

### Client
- Create and manage own ads
- Submit payments
- View notifications
- Access: `/dashboard/*`

### Moderator
- Review pending ads
- Approve/reject ads
- View moderation history
- Access: `/moderator/*`

### Admin
- All moderator permissions
- Manage users (change roles, disable)
- Verify payments
- View analytics
- Access: `/admin/*`, `/moderator/*`

### Super Admin
- All admin permissions
- Manage categories, cities, packages
- System configuration
- Access: All portals

## 🔄 Moderation Workflow

### Ad Submission Flow

```
1. Client creates ad → status: 'draft'
2. Client submits ad → status: 'submitted'
3. Moderator reviews → status: 'under_review'
4. Moderator approves → status: 'payment_pending'
   OR
   Moderator rejects → status: 'archived' (with rejection_reason)
5. Client submits payment → status: 'payment_submitted'
6. Admin verifies payment → status: 'payment_verified'
7. Admin schedules ad → status: 'scheduled' or 'published'
```

### Moderator Actions

**Approve Ad:**
- Updates status to `payment_pending`
- Records `reviewed_by` and `reviewed_at`
- Sends notification to user
- Logs action in audit_logs

**Reject Ad:**
- Updates status to `archived`
- Requires `rejection_reason`
- Records `reviewed_by` and `reviewed_at`
- Sends notification to user with reason
- Logs action in audit_logs

## 🛡️ Security Features

### Route Protection
- Middleware validates user role on every request
- Server-side role checks in all API routes
- Client-side fallback for additional security

### RLS Policies
```sql
-- Moderators can view all ads
CREATE POLICY "ads_select_staff" ON ads
  FOR SELECT USING (get_user_role() IN ('moderator', 'admin', 'super_admin'));

-- Moderators can update ads for review
CREATE POLICY "ads_update_moderator" ON ads
  FOR UPDATE USING (get_user_role() IN ('moderator', 'admin', 'super_admin'));
```

### Audit Logging
All moderation and admin actions are logged:
- Actor ID and email
- Action type
- Entity affected
- Old and new data
- Timestamp and IP

## 📊 API Endpoints

### Moderator APIs
- `POST /api/moderator/review` - Approve/reject ads
- `GET /api/moderator/review-queue` - Get pending ads

### Admin APIs
- `GET /api/admin/users` - List all users
- `PATCH /api/admin/users/[id]` - Update user role/status
- `POST /api/admin/payments/[id]/verify` - Verify/reject payment
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/analytics/summary` - Analytics data

## 🧪 Testing

### Test Accounts
```
Email: client@test.com
Password: TestPass123!
Role: Client

Email: moderator@test.com
Password: TestPass123!
Role: Moderator

Email: admin@test.com
Password: TestPass123!
Role: Admin

Email: superadmin@test.com
Password: TestPass123!
Role: Super Admin
```

### Test Workflow

1. **Login as Client** (client@test.com)
   - Create a new ad
   - Submit it for review

2. **Login as Moderator** (moderator@test.com)
   - Go to Pending Review
   - Approve or reject the ad
   - Check approved/rejected lists

3. **Login as Admin** (admin@test.com)
   - View dashboard statistics
   - Manage users
   - Verify payments
   - View analytics

## 🐛 Troubleshooting

### Issue: "Unauthorized" error
**Solution:** Check that:
- User exists in both `auth.users` and `users` table
- Role is correctly set in `users` or `profiles` table
- Middleware is running (check `middleware.ts`)

### Issue: Can't access moderator/admin portal
**Solution:**
```sql
-- Check user role
SELECT id, email, role FROM users WHERE email = 'your@email.com';

-- Update role if needed
UPDATE users SET role = 'moderator' WHERE email = 'your@email.com';
```

### Issue: RLS policy blocking access
**Solution:**
```sql
-- Check if get_user_role() function works
SELECT get_user_role();

-- Verify RLS policies
SELECT * FROM pg_policies WHERE tablename = 'ads';
```

## 📁 File Structure

```
app/
├── admin/
│   ├── layout.tsx              # Admin layout with sidebar
│   ├── login/
│   │   └── page.tsx           # Admin login page
│   ├── page.tsx               # Admin dashboard
│   ├── users/
│   │   └── page.tsx           # User management
│   └── analytics/
│       └── page.tsx           # Analytics dashboard
├── moderator/
│   ├── layout.tsx             # Moderator layout
│   ├── login/
│   │   └── page.tsx          # Moderator login
│   ├── page.tsx              # Moderator dashboard
│   ├── pending/
│   │   └── page.tsx          # Pending review queue
│   ├── approved/
│   │   └── page.tsx          # Approved ads
│   └── rejected/
│       └── page.tsx          # Rejected ads
└── api/
    ├── moderator/
    │   └── review/
    │       └── route.ts       # Review API
    └── admin/
        ├── users/
        │   └── route.ts       # User management API
        └── payments/
            └── [id]/verify/
                └── route.ts   # Payment verification API

components/
├── moderator/
│   ├── moderator-sidebar.tsx
│   ├── moderator-topbar.tsx
│   └── ad-review-card.tsx
└── admin/
    └── user-management-table.tsx

lib/
├── auth.ts                    # Auth utilities
├── roles.ts                   # Role management
└── supabase/
    └── server.ts             # Supabase client

middleware.ts                  # Route protection

supabase/
└── migrations/
    ├── 001_initial_schema.sql
    └── 002_add_moderation_fields.sql
```

## 🚀 Deployment Checklist

- [ ] Run database migrations
- [ ] Create production admin/moderator accounts
- [ ] Update environment variables
- [ ] Test all authentication flows
- [ ] Verify RLS policies are active
- [ ] Test moderation workflow end-to-end
- [ ] Check audit logging is working
- [ ] Verify email notifications
- [ ] Test on mobile devices
- [ ] Set up monitoring/alerts

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review the code comments
3. Check Supabase logs
4. Review browser console for errors

## 🎉 Success!

Your production-ready Moderator & Admin system is now set up! The system includes:
- ✅ Secure authentication
- ✅ Role-based access control
- ✅ Complete moderation workflow
- ✅ Admin dashboard with analytics
- ✅ User management
- ✅ Payment verification
- ✅ Audit logging
- ✅ Test accounts ready to use

**Next Steps:**
1. Create your production admin accounts
2. Customize the UI/branding as needed
3. Set up email templates for notifications
4. Configure production environment variables
5. Deploy to your hosting platform
