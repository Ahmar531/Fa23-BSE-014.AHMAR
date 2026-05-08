# 🚀 Production Deployment Checklist

## Pre-Deployment

### Database
- [ ] Run all migrations in production Supabase
  - [ ] `001_initial_schema.sql`
  - [ ] `002_add_moderation_fields.sql`
- [ ] Verify RLS policies are enabled
- [ ] Test RLS policies with different roles
- [ ] Create database backups

### Authentication
- [ ] Create production admin account
- [ ] Create production moderator accounts
- [ ] Test login flows for all roles
- [ ] Verify password reset works
- [ ] Test magic link authentication

### Environment Variables
- [ ] Set `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Set `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Set `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- [ ] Set `NEXT_PUBLIC_APP_URL`
- [ ] Set `CRON_SECRET` (if using cron jobs)
- [ ] Remove or secure test account credentials

### Security
- [ ] Review and update CORS settings
- [ ] Enable rate limiting on auth endpoints
- [ ] Set up IP allowlisting (if needed)
- [ ] Configure Supabase Auth settings
  - [ ] Email confirmation
  - [ ] Password requirements
  - [ ] Session timeout
- [ ] Review RLS policies for all tables
- [ ] Test unauthorized access attempts

## Testing

### Functional Testing
- [ ] Test client ad creation flow
- [ ] Test moderator review workflow
  - [ ] Approve ad
  - [ ] Reject ad with reason
  - [ ] View history
- [ ] Test admin user management
  - [ ] Change user roles
  - [ ] Disable users
- [ ] Test payment verification
- [ ] Test notifications
- [ ] Test audit logging

### Role-Based Access Testing
- [ ] Client cannot access `/moderator/*`
- [ ] Client cannot access `/admin/*`
- [ ] Moderator can access `/moderator/*`
- [ ] Moderator cannot access `/admin/*`
- [ ] Admin can access both `/admin/*` and `/moderator/*`
- [ ] Super admin can access all portals

### Security Testing
- [ ] Test direct URL access to protected routes
- [ ] Test API endpoints without authentication
- [ ] Test API endpoints with wrong role
- [ ] Test SQL injection attempts
- [ ] Test XSS attempts
- [ ] Test CSRF protection

### Performance Testing
- [ ] Test with 100+ ads in review queue
- [ ] Test with 1000+ users
- [ ] Check page load times
- [ ] Test database query performance
- [ ] Monitor memory usage

## Deployment

### Build & Deploy
- [ ] Run `npm run build` successfully
- [ ] Fix any TypeScript errors
- [ ] Fix any ESLint warnings
- [ ] Deploy to hosting platform (Vercel/Netlify/etc)
- [ ] Verify deployment URL

### Post-Deployment Verification
- [ ] Test all login flows
- [ ] Test moderator workflow
- [ ] Test admin dashboard
- [ ] Check error logging
- [ ] Verify email notifications
- [ ] Test on mobile devices
- [ ] Test on different browsers

## Monitoring & Maintenance

### Set Up Monitoring
- [ ] Configure error tracking (Sentry/etc)
- [ ] Set up uptime monitoring
- [ ] Configure performance monitoring
- [ ] Set up database monitoring
- [ ] Create alerts for critical errors

### Documentation
- [ ] Document admin procedures
- [ ] Document moderator guidelines
- [ ] Create user training materials
- [ ] Document escalation procedures
- [ ] Create runbook for common issues

### Backup & Recovery
- [ ] Set up automated database backups
- [ ] Test backup restoration
- [ ] Document recovery procedures
- [ ] Set up disaster recovery plan

## Production Accounts

### Create Real Accounts
- [ ] Remove test accounts or disable them
- [ ] Create real admin accounts with strong passwords
- [ ] Create real moderator accounts
- [ ] Document account credentials securely
- [ ] Set up 2FA for admin accounts (if available)

### Account Management
- [ ] Define role assignment process
- [ ] Create account request workflow
- [ ] Set up account deactivation process
- [ ] Document password reset procedures

## Compliance & Legal

### Data Protection
- [ ] Review GDPR compliance (if applicable)
- [ ] Set up data retention policies
- [ ] Configure data export functionality
- [ ] Set up data deletion procedures

### Audit & Logging
- [ ] Verify audit logs are working
- [ ] Set up log retention policy
- [ ] Configure log analysis tools
- [ ] Document audit procedures

## Performance Optimization

### Database
- [ ] Add indexes for frequently queried columns
- [ ] Optimize slow queries
- [ ] Set up connection pooling
- [ ] Configure query caching

### Frontend
- [ ] Enable image optimization
- [ ] Configure CDN
- [ ] Minimize bundle size
- [ ] Enable compression

## Support & Training

### Team Training
- [ ] Train moderators on review workflow
- [ ] Train admins on user management
- [ ] Train support team on common issues
- [ ] Create video tutorials

### Support Setup
- [ ] Set up support email/system
- [ ] Create FAQ documentation
- [ ] Set up escalation procedures
- [ ] Document common troubleshooting steps

## Launch

### Pre-Launch
- [ ] Final security review
- [ ] Final performance test
- [ ] Backup current production data
- [ ] Notify team of launch schedule

### Launch Day
- [ ] Deploy to production
- [ ] Monitor error logs
- [ ] Monitor performance metrics
- [ ] Be available for immediate fixes
- [ ] Communicate with stakeholders

### Post-Launch
- [ ] Monitor for 24-48 hours
- [ ] Collect user feedback
- [ ] Address critical issues immediately
- [ ] Plan for improvements
- [ ] Document lessons learned

## Rollback Plan

### If Issues Occur
- [ ] Document rollback procedure
- [ ] Keep previous version accessible
- [ ] Test rollback in staging
- [ ] Communicate rollback plan to team

## Success Metrics

### Track These Metrics
- [ ] User login success rate
- [ ] Average moderation time
- [ ] Ad approval rate
- [ ] System uptime
- [ ] Error rate
- [ ] Page load times
- [ ] User satisfaction

## Contact Information

### Key Personnel
- [ ] Document admin contacts
- [ ] Document moderator contacts
- [ ] Document technical support contacts
- [ ] Document escalation contacts

---

## Quick Reference

### Production URLs
- Client Portal: `https://yourdomain.com/auth/login`
- Moderator Desk: `https://yourdomain.com/moderator/login`
- Admin Console: `https://yourdomain.com/admin/login`

### Emergency Contacts
- Technical Lead: [Name/Email]
- Database Admin: [Name/Email]
- Security Contact: [Name/Email]

### Critical Commands
```bash
# Build for production
npm run build

# Start production server
npm start

# Check logs
# (depends on hosting platform)

# Database backup
# (via Supabase Dashboard or CLI)
```

---

**Last Updated:** [Date]
**Reviewed By:** [Name]
**Next Review:** [Date]
