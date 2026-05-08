/**
 * Unit tests for role-based access control helpers.
 * Validates that each role gets access to the correct portals and routes.
 */
import {
  normalizeRole,
  canAccessPortal,
  canAccessProtectedPortal,
  getRoleHomePath,
  getProtectedPortalFromPath,
  getLoginPathForProtectedPortal,
  getRoleBadgeLabel,
} from '@/lib/roles';
import type { UserRole } from '@/lib/types';

describe('normalizeRole()', () => {
  it('returns valid roles as-is', () => {
    expect(normalizeRole('client')).toBe('client');
    expect(normalizeRole('moderator')).toBe('moderator');
    expect(normalizeRole('admin')).toBe('admin');
    expect(normalizeRole('super_admin')).toBe('super_admin');
  });

  it('returns null for unknown or empty values', () => {
    expect(normalizeRole('unknown')).toBeNull();
    expect(normalizeRole('')).toBeNull();
    expect(normalizeRole(null)).toBeNull();
    expect(normalizeRole(undefined)).toBeNull();
    expect(normalizeRole(42)).toBeNull();
  });
});

describe('getRoleHomePath()', () => {
  it('maps each role to the correct dashboard path', () => {
    expect(getRoleHomePath('client')).toBe('/dashboard');
    expect(getRoleHomePath('moderator')).toBe('/moderator');
    expect(getRoleHomePath('admin')).toBe('/admin');
    expect(getRoleHomePath('super_admin')).toBe('/super-admin');
  });
});

describe('canAccessPortal()', () => {
  // client portal — all roles can access
  it('client portal: all roles allowed', () => {
    const roles: UserRole[] = ['client', 'moderator', 'admin', 'super_admin'];
    roles.forEach((role) => expect(canAccessPortal(role, 'client')).toBe(true));
  });

  // moderator portal — moderator, admin, super_admin
  it('moderator portal: client is denied', () => {
    expect(canAccessPortal('client', 'moderator')).toBe(false);
  });
  it('moderator portal: moderator/admin/super_admin are allowed', () => {
    expect(canAccessPortal('moderator', 'moderator')).toBe(true);
    expect(canAccessPortal('admin', 'moderator')).toBe(true);
    expect(canAccessPortal('super_admin', 'moderator')).toBe(true);
  });

  // admin portal — admin, super_admin only
  it('admin portal: client and moderator are denied', () => {
    expect(canAccessPortal('client', 'admin')).toBe(false);
    expect(canAccessPortal('moderator', 'admin')).toBe(false);
  });
  it('admin portal: admin and super_admin are allowed', () => {
    expect(canAccessPortal('admin', 'admin')).toBe(true);
    expect(canAccessPortal('super_admin', 'admin')).toBe(true);
  });
});

describe('canAccessProtectedPortal()', () => {
  it('super_admin portal: only super_admin is allowed', () => {
    expect(canAccessProtectedPortal('super_admin', 'super_admin')).toBe(true);
    expect(canAccessProtectedPortal('admin', 'super_admin')).toBe(false);
    expect(canAccessProtectedPortal('moderator', 'super_admin')).toBe(false);
    expect(canAccessProtectedPortal('client', 'super_admin')).toBe(false);
  });
});

describe('getProtectedPortalFromPath()', () => {
  it('detects admin paths', () => {
    expect(getProtectedPortalFromPath('/admin')).toBe('admin');
    expect(getProtectedPortalFromPath('/admin/users')).toBe('admin');
    expect(getProtectedPortalFromPath('/admin/ads/123/schedule')).toBe('admin');
  });

  it('detects moderator paths', () => {
    expect(getProtectedPortalFromPath('/moderator')).toBe('moderator');
    expect(getProtectedPortalFromPath('/moderator/queue')).toBe('moderator');
  });

  it('detects super-admin paths', () => {
    expect(getProtectedPortalFromPath('/super-admin')).toBe('super_admin');
  });

  it('detects client dashboard paths', () => {
    expect(getProtectedPortalFromPath('/dashboard')).toBe('client');
    expect(getProtectedPortalFromPath('/dashboard/ads/create')).toBe('client');
  });

  it('returns null for public paths', () => {
    expect(getProtectedPortalFromPath('/')).toBeNull();
    expect(getProtectedPortalFromPath('/explore')).toBeNull();
    expect(getProtectedPortalFromPath('/packages')).toBeNull();
    expect(getProtectedPortalFromPath('/auth/login')).toBeNull();
  });
});

describe('getLoginPathForProtectedPortal()', () => {
  it('routes admin/super_admin to /admin/login', () => {
    expect(getLoginPathForProtectedPortal('admin')).toBe('/admin/login');
    expect(getLoginPathForProtectedPortal('super_admin')).toBe('/admin/login');
  });

  it('routes moderator to /moderator/login', () => {
    expect(getLoginPathForProtectedPortal('moderator')).toBe('/moderator/login');
  });

  it('routes client to /auth/login', () => {
    expect(getLoginPathForProtectedPortal('client')).toBe('/auth/login');
  });
});

describe('getRoleBadgeLabel()', () => {
  it('returns correct human-readable labels', () => {
    expect(getRoleBadgeLabel('client')).toBe('Client');
    expect(getRoleBadgeLabel('moderator')).toBe('Moderator');
    expect(getRoleBadgeLabel('admin')).toBe('Admin');
    expect(getRoleBadgeLabel('super_admin')).toBe('Super Admin');
  });
});
