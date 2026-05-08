import { createClient } from './supabase/server';
import { createAdminClient } from './supabase/server';
import type { UserRole } from './types';
import { normalizeRole as normalizeStoredRole } from './roles';

export type AuthenticatedUser = {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string | null;
  disabled?: boolean;
};

type RoleLookupRecord = {
  role: UserRole | null;
  profile: {
    email?: string | null;
    full_name?: string | null;
    created_at?: string | null;
    disabled?: boolean | null;
  } | null;
  appUser: {
    email?: string | null;
    full_name?: string | null;
    created_at?: string | null;
    deleted_at?: string | null;
  } | null;
};

async function resolveStoredRoleRecord(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<RoleLookupRecord> {
  const [{ data: profile }, { data: appUser }] = await Promise.all([
    supabase
      .from('profiles')
      .select('email, role, created_at, full_name, disabled')
      .eq('id', userId)
      .maybeSingle(),
    supabase
      .from('users')
      .select('email, role, created_at, full_name, deleted_at')
      .eq('id', userId)
      .maybeSingle(),
  ]);

  return {
    role: normalizeStoredRole(profile?.role) ?? normalizeStoredRole(appUser?.role),
    profile,
    appUser,
  };
}

function buildAuthenticatedUser(params: {
  authUser: { id: string; email?: string | null; user_metadata?: Record<string, unknown> };
  lookup: RoleLookupRecord;
}) {
  const { authUser, lookup } = params;

  return {
    id: authUser.id,
    email: lookup.profile?.email ?? lookup.appUser?.email ?? authUser.email ?? '',
    full_name:
      lookup.profile?.full_name ??
      lookup.appUser?.full_name ??
      (typeof authUser.user_metadata?.full_name === 'string' ? authUser.user_metadata.full_name : null),
    role: lookup.role ?? 'client',
    created_at: lookup.profile?.created_at ?? lookup.appUser?.created_at ?? null,
    disabled: Boolean(lookup.profile?.disabled || lookup.appUser?.deleted_at),
  } as AuthenticatedUser;
}

/**
 * Get current authenticated user with role
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const lookup = await resolveStoredRoleRecord(supabase, user.id);
  return buildAuthenticatedUser({ authUser: user, lookup });
}

/**
 * Check if user has required role
 */
export async function hasRole(requiredRoles: UserRole[]): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  return requiredRoles.includes(user.role);
}

/**
 * Require authentication (throws if not authenticated)
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }

  if (user.disabled) {
    throw new Error('Account disabled');
  }

  return user;
}

/**
 * Require specific role (throws if not authorized)
 */
export async function requireRole(requiredRoles: UserRole[]) {
  const user = await requireAuth();
  if (!requiredRoles.includes(user.role)) {
    throw new Error('Forbidden');
  }
  return user;
}

export function normalizeRole(role: string | null | undefined): UserRole | null {
  return normalizeStoredRole(role ?? null);
}

export async function getStoredRoleByEmail(email: string) {
  let supabase: ReturnType<typeof createAdminClient> | null = null;

  try {
    supabase = createAdminClient();
  } catch {
    return undefined;
  }

  const [{ data: profile }, { data: appUser }] = await Promise.all([
    supabase.from('profiles').select('role').eq('email', email).maybeSingle(),
    supabase.from('users').select('role').eq('email', email).maybeSingle(),
  ]);

  return normalizeStoredRole(profile?.role) ?? normalizeStoredRole(appUser?.role);
}
