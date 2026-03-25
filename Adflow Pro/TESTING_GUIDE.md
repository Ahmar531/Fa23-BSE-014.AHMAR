# 🧪 AdFlow Pro - Testing Guide

## Pre-Deployment Testing Checklist

### 1. Database Setup ✅

```sql
-- Verify all tables exist
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

-- Expected tables (13):
-- ad_media, ad_status_history, ads, audit_logs, categories, cities
-- learning_questions, notifications, packages, payments
-- seller_profiles, system_health_logs, users

-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND rowsecurity = true;

-- All 13 tables should have RLS enabled
```

### 2. Authentication Testing

**Test User Registration:**
1. Go to `/auth/register`
2. Fill form with valid data
3. Submit
4. Should redirect to dashboard
5. Check `public.users` table for new entry

**Test User Login:**
1. Go to `/auth/login`
2. Enter credentials
3. Should redirect to dashboard
4. Session should persist

**Test Logout:**
1. Click logout button
2. Should redirect to home
3. Session should be cleared

### 3. Ad Creation Flow

**As Client:**
1. Login to dashboard
2. Click "Create Ad"
3. Fill all required fields:
   - Title (min 10 chars)
   - Description (min 50 chars)
   - Category
   - City
   - Package
   - Contact info
   - Media URLs (optional)
4. Submit
5. Should create ad with status='draft'
6. Should redirect to ad detail page

**Verify in Database:**
```sql
SELECT id, title, status, user_id, package_id 
FROM ads 
WHERE user_id = 'your-user-id' 
ORDER BY created_at DESC 
LIMIT 1;
```

### 4. Ad Lifecycle Testing

**Test Status Transitions:**

```sql
-- 1. Draft → Submitted
UPDATE ads SET status = 'submitted' WHERE id = 'ad-id';

-- 2. Submitted → Under Review (Moderator)
UPDATE ads SET status = 'under_review' WHERE id = 'ad-id';

-- 3. Under Review → Payment Pending (Moderator approves)
UPDATE ads SET status = 'payment_pending' WHERE id = 'ad-id';

-- 4. Create payment record
INSERT INTO payments (ad_id, user_id, package_id, amount, currency)
VALUES ('ad-id', 'user-id', 'package-id', 2999, 'PKR');

-- 5. Payment Pending → Payment Submitted (User submits proof)
UPDATE payments SET status = 'submitted', submitted_at = NOW() WHERE ad_id = 'ad-id';
UPDATE ads SET status = 'payment_submitted' WHERE id = 'ad-id';

-- 6. Payment Submitted → Payment Verified (Admin verifies)
UPDATE payments SET status = 'verified', verified_at = NOW() WHERE ad_id = 'ad-id';
UPDATE ads SET status = 'payment_verified' WHERE id = 'ad-id';

-- 7. Payment Verified → Scheduled
UPDATE ads SET status = 'scheduled', publish_at = NOW() + INTERVAL '1 hour' WHERE id = 'ad-id';

-- 8. Scheduled → Published (Cron job or manual)
UPDATE ads SET status = 'published', expire_at = NOW() + INTERVAL '7 days' WHERE id = 'ad-id';

-- 9. Published → Expired (Cron job)
UPDATE ads SET status = 'expired' WHERE expire_at < NOW();
```

### 5. Package System Testing

**Verify Packages:**
```sql
SELECT * FROM packages ORDER BY price;
-- Should show: Basic (2999), Standard (6999), Premium (14999)
```

**Test Package Selection:**
1. Create ad with each package
2. Verify package_id is set correctly
3. Check pricing displays correctly

### 6. Search & Filter Testing

**Test Search:**
1. Go to `/explore`
2. Enter search term
3. Should filter ads by title/description
4. Results should update

**Test Category Filter:**
1. Select category from dropdown
2. Should show only ads in that category
3. URL should update with `?category=slug`

**Test City Filter:**
1. Select city from dropdown
2. Should show only ads in that city
3. URL should update with `?city=slug`

**Test Pagination:**
1. If more than 12 ads exist
2. Should show pagination controls
3. Click next/previous
4. Should load correct page

### 7. Ranking Algorithm Testing

**Verify Rank Score Calculation:**
```sql
-- Test ranking formula
SELECT 
  id,
  title,
  is_featured,
  rank_score,
  (CASE WHEN is_featured THEN 50 ELSE 0 END) as featured_bonus,
  freshness_points,
  admin_boost
FROM ads 
WHERE status = 'published'
ORDER BY rank_score DESC;

-- Featured ads should have rank_score >= 50
-- Premium package ads should rank higher than Basic
```

### 8. Media Handling Testing

**Test Direct Image URL:**
```sql
INSERT INTO ad_media (ad_id, source_type, original_url)
VALUES ('ad-id', 'direct_image', 'https://example.com/image.jpg');
```

**Test GitHub Raw URL:**
```sql
INSERT INTO ad_media (ad_id, source_type, original_url)
VALUES ('ad-id', 'github_raw', 'https://raw.githubusercontent.com/user/repo/main/image.png');
```

**Test YouTube URL:**
```sql
INSERT INTO ad_media (ad_id, source_type, original_url, youtube_video_id)
VALUES ('ad-id', 'youtube', 'https://youtube.com/watch?v=VIDEO_ID', 'VIDEO_ID');
```

### 9. Notification Testing

**Verify Notifications Created:**
```sql
-- Check notifications for user
SELECT * FROM notifications 
WHERE user_id = 'your-user-id' 
ORDER BY created_at DESC;

-- Test notification types
INSERT INTO notifications (user_id, type, title, message)
VALUES ('user-id', 'status_change', 'Test', 'Test message');
```

### 10. Cron Job Testing

**Test Publish Scheduled Ads:**
```bash
# Manually trigger cron endpoint
curl -X GET http://localhost:3000/api/cron/publish-scheduled \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# Should return: { "success": true, "published": N }
```

**Test Expire Ads:**
```bash
curl -X GET http://localhost:3000/api/cron/expire-ads \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# Should return: { "success": true, "expired": N, "reminders": M }
```

**Test Health Check:**
```bash
curl http://localhost:3000/api/health/db

# Should return: { "status": "ok", "duration_ms": N }
```

### 11. Role-Based Access Testing

**Test Client Access:**
- ✅ Can access `/dashboard`
- ✅ Can create ads
- ✅ Can view own ads
- ❌ Cannot access `/moderator`
- ❌ Cannot access `/admin`

**Test Moderator Access:**
- ✅ Can access `/moderator`
- ✅ Can review ads
- ✅ Can approve/reject ads
- ❌ Cannot verify payments
- ❌ Cannot access `/admin`

**Test Admin Access:**
- ✅ Can access `/admin`
- ✅ Can verify payments
- ✅ Can schedule ads
- ✅ Can view analytics
- ✅ Can mark as featured

### 12. Security Testing

**Test RLS Policies:**
```sql
-- As anonymous user, should only see published ads
SET ROLE anon;
SELECT * FROM ads; -- Should only return published, non-expired ads

-- As authenticated user, should see own ads
SET ROLE authenticated;
SELECT * FROM ads WHERE user_id = auth.uid(); -- Should work

-- Reset role
RESET ROLE;
```

**Test Input Validation:**
1. Try submitting ad with short title (< 10 chars) - Should fail
2. Try submitting ad with short description (< 50 chars) - Should fail
3. Try submitting invalid email - Should fail
4. Try submitting invalid URL - Should fail

### 13. Performance Testing

**Check Query Performance:**
```sql
-- Explain analyze for main queries
EXPLAIN ANALYZE
SELECT * FROM v_public_ads 
ORDER BY rank_score DESC 
LIMIT 12;

-- Should use indexes efficiently
-- Execution time should be < 100ms
```

### 14. Error Handling Testing

**Test Database Errors:**
1. Stop Supabase temporarily
2. Try loading pages
3. Should show graceful error messages
4. Should not crash

**Test Invalid Routes:**
1. Go to `/ads/invalid-slug`
2. Should show 404 or error message
3. Should not crash

### 15. Mobile Responsiveness Testing

**Test on Different Devices:**
- ✅ Mobile (320px - 480px)
- ✅ Tablet (768px - 1024px)
- ✅ Desktop (1280px+)

**Check:**
- Navigation menu works
- Forms are usable
- Cards display properly
- Buttons are clickable
- Text is readable

---

## Automated Testing Script

```bash
#!/bin/bash

echo "🧪 Running AdFlow Pro Tests..."

# 1. Check environment
if [ ! -f .env.local ]; then
  echo "❌ .env.local not found"
  exit 1
fi

# 2. Check dependencies
npm list next react supabase || exit 1

# 3. Build project
npm run build || exit 1

# 4. Run linter
npm run lint || exit 1

echo "✅ All tests passed!"
```

---

## Production Deployment Checklist

Before deploying to production:

- [ ] All tests pass
- [ ] Database migration successful
- [ ] Environment variables configured
- [ ] Cron jobs scheduled
- [ ] Email templates configured
- [ ] Error monitoring setup
- [ ] Backup strategy in place
- [ ] SSL certificate active
- [ ] Domain configured
- [ ] Analytics tracking setup

---

## Common Issues & Solutions

### Issue: "Supabase URL required"
**Solution**: Add credentials to `.env.local` and restart server

### Issue: "Failed to create user"
**Solution**: Run `003_fix_users_insert.sql` migration

### Issue: "RLS policy violation"
**Solution**: Check user role and table policies

### Issue: "Cron job not running"
**Solution**: Verify `CRON_SECRET` matches in Vercel and code

### Issue: "Ads not showing"
**Solution**: Check ad status is 'published' and not expired

---

## Success Criteria

✅ Users can register and login
✅ Ads can be created and published
✅ Search and filters work
✅ Payments can be tracked
✅ Cron jobs execute successfully
✅ Notifications are sent
✅ Analytics display correctly
✅ Mobile responsive
✅ No console errors
✅ Fast page loads (< 2s)

---

**Testing Status**: Ready for comprehensive testing

Run through this checklist before production deployment!
