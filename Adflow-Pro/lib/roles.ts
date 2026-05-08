import type { UserRole } from '@/lib/types';

export const ALL_USER_ROLES = ['client', 'moderator', 'admin', 'super_admin'] as const satisfies UserRole[];

export type PortalId = 'client' | 'moderator' | 'admin';

export type PortalDefinition = {
  id: PortalId;
  label: string;
  description: string;
  accessHint: string;
  href: string;
  loginHref: string;
  allowedRoles: UserRole[];
};

export const ROLE_HOME: Record<UserRole, string> = {
  client: '/dashboard',
  moderator: '/moderator',
  admin: '/admin',
  super_admin: '/super-admin',
};

export const PORTAL_DEFINITIONS: PortalDefinition[] = [
  {
    id: 'client',
    label: 'Client Console',
    description: 'Create ads, track approvals, and manage payments.',
    accessHint: 'Sign in with any authenticated marketplace account.',
    href: '/dashboard',
    loginHref: '/auth/login',
    allowedRoles: [...ALL_USER_ROLES],
  },
  {
    id: 'moderator',
    label: 'Moderator Desk',
    description: 'Review pending ads and record moderation decisions.',
    accessHint: 'Use a moderator, admin, or super admin account.',
    href: '/moderator',
    loginHref: '/moderator/login',
    allowedRoles: ['moderator', 'admin', 'super_admin'],
  },
  {
    id: 'admin',
    label: 'Admin Console',
    description: 'Manage users, ads, analytics, and privileged controls.',
    accessHint: 'Use an admin or super admin account.',
    href: '/admin',
    loginHref: '/admin/login',
    allowedRoles: ['admin', 'super_admin'],
  },
];

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === 'string' && ALL_USER_ROLES.includes(value as UserRole);
}

export function normalizeRole(value: unknown): UserRole | null {
  return isUserRole(value) ? value : null;
}

export function getRoleHomePath(role: UserRole) {
  return ROLE_HOME[role];
}

export function canAccessPortal(role: UserRole, portalId: PortalId) {
  const portal = PORTAL_DEFINITIONS.find((item) => item.id === portalId);
  return portal ? portal.allowedRoles.includes(role) : false;
}

export function getPortalsForRole(role: UserRole) {
  return PORTAL_DEFINITIONS.map((portal) => ({
    ...portal,
    canAccess: canAccessPortal(role, portal.id),
  }));
}

export function getProtectedPortalFromPath(pathname: string): PortalId | 'super_admin' | null {
  if (pathname.startsWith('/admin')) return 'admin';
  if (pathname.startsWith('/moderator')) return 'moderator';
  if (pathname.startsWith('/super-admin')) return 'super_admin';
  if (pathname.startsWith('/dashboard')) return 'client';
  return null;
}

export function getLoginPathForProtectedPortal(portal: PortalId | 'super_admin') {
  if (portal === 'admin' || portal === 'super_admin') return '/admin/login';
  if (portal === 'moderator') return '/moderator/login';
  return '/auth/login';
}

export function canAccessProtectedPortal(role: UserRole, portal: PortalId | 'super_admin') {
  if (portal === 'super_admin') return role === 'super_admin';
  return canAccessPortal(role, portal);
}

export function getRoleBadgeLabel(role: UserRole) {
  switch (role) {
    case 'super_admin':
      return 'Super Admin';
    case 'admin':
      return 'Admin';
    case 'moderator':
      return 'Moderator';
    default:
      return 'Client';
  }
}
