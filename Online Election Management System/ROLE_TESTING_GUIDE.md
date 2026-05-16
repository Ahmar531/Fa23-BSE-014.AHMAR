# 🧪 Role-Based Access Testing Guide

## Issue That Was Fixed
Election creators voter dashboard access kar pa rahe the. Ab ye fix ho gaya hai.

---

## How to Test

### Test 1: Voter Registration & Access
1. **Register as Voter**
   - Go to `/register`
   - Select "Voter" role
   - Fill form and submit
   - Verify email (if enabled)

2. **Login as Voter**
   - Login with voter credentials
   - Should redirect to `/voter` dashboard
   - Check sidebar - should show voter menu only

3. **Try Accessing Creator Routes**
   - Manually type `/creator` in URL
   - Should automatically redirect back to `/voter`
   - This confirms voter cannot access creator routes ✅

---

### Test 2: Election Creator Registration & Approval
1. **Register as Election Creator**
   - Go to `/register`
   - Select "Election Creator" role
   - Fill form and submit
   - Should see "Creator Request Submitted" message
   - User is automatically logged out

2. **Check Database**
   ```sql
   -- User should have role='voter' initially
   SELECT id, name, email, role FROM users WHERE email='creator@test.com';
   
   -- Should have pending approval request
   SELECT * FROM creator_requests WHERE user_id='<user_id>';
   ```

3. **Try Login Before Approval**
   - Login with creator credentials
   - Should redirect to `/voter` dashboard (because role is still 'voter')
   - Cannot access `/creator` routes yet ✅

4. **Admin Approves Request**
   - Login as admin
   - Go to `/admin/approvals`
   - Approve the creator request
   - System updates user role to 'election_creator'

5. **Login After Approval**
   - Logout and login again with creator credentials
   - Should redirect to `/creator` dashboard
   - Check sidebar - should show creator menu only

6. **Try Accessing Voter Routes**
   - Manually type `/voter` in URL
   - Should automatically redirect back to `/creator`
   - This confirms creator cannot access voter routes ✅

---

### Test 3: Admin Access
1. **Login as Admin**
   - Should redirect to `/admin` dashboard

2. **Check Admin Can Access Creator Routes**
   - Go to `/creator`
   - Should work (admins can manage elections too)

3. **Check Admin Cannot Access Voter Routes**
   - Go to `/voter`
   - Should redirect to `/admin`

---

## Expected Behavior Summary

| Role | Can Access | Cannot Access |
|------|-----------|---------------|
| **Voter** | `/voter/*`, `/vote/:id` | `/creator/*`, `/admin/*` |
| **Election Creator** | `/creator/*` | `/voter/*`, `/vote/:id`, `/admin/*` |
| **Admin** | `/admin/*`, `/creator/*` | `/voter/*`, `/vote/:id` |

---

## Quick SQL Commands for Testing

### Create Admin User
```sql
-- First register normally, then update role
UPDATE users SET role='admin' WHERE email='admin@test.com';
```

### Check User Roles
```sql
SELECT id, name, email, role, verified FROM users ORDER BY created_at DESC;
```

### Check Creator Requests
```sql
SELECT 
  cr.id,
  u.name,
  u.email,
  cr.status,
  cr.created_at
FROM creator_requests cr
JOIN users u ON u.id = cr.user_id
ORDER BY cr.created_at DESC;
```

### Manually Approve Creator
```sql
-- Update request status
UPDATE creator_requests 
SET status='approved', updated_at=NOW() 
WHERE user_id='<user_id>';

-- Update user role
UPDATE users 
SET role='election_creator', verified=true 
WHERE id='<user_id>';
```

---

## Common Issues & Solutions

### Issue: Creator can still access voter routes
**Solution:** Clear browser cache and localStorage, then login again

### Issue: Voter can access creator routes
**Solution:** Check database - user role should be 'voter', not 'election_creator'

### Issue: Infinite redirect loop
**Solution:** Check `ProtectedRoute.jsx` - make sure role-based redirects are correct

---

## Files That Control Access

1. **`src/App.jsx`** - Route definitions with role restrictions
2. **`src/routes/ProtectedRoute.jsx`** - Role validation logic
3. **`src/contexts/AuthContext.jsx`** - User authentication & profile
4. **`src/components/layout/Sidebar.jsx`** - Role-based menu display

---

## Testing Checklist

- [ ] Voter can register and access voter dashboard
- [ ] Voter CANNOT access `/creator` routes
- [ ] Creator registration creates approval request
- [ ] Creator gets role='voter' initially
- [ ] Creator CANNOT access creator routes before approval
- [ ] Admin can approve creator request
- [ ] After approval, creator role becomes 'election_creator'
- [ ] Approved creator can access creator dashboard
- [ ] Approved creator CANNOT access `/voter` routes
- [ ] Admin can access admin and creator routes
- [ ] Admin CANNOT access voter routes
- [ ] Manual URL typing redirects to correct dashboard

---

**All tests passing = Role-based access control working perfectly! ✅**
