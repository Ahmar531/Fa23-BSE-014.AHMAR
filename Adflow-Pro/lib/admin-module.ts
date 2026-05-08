import { createAdminClient, createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/auth';
import type { UserRole } from '@/lib/types';
import { getStatusesForModerationView } from '@/lib/moderation';

type AdminViewStatus = 'all' | 'pending' | 'approved' | 'rejected' | 'active';
type AdminDataClient = Awaited<ReturnType<typeof createClient>> | ReturnType<typeof createAdminClient>;

type ManageRules = {
  canManageTarget: boolean;
  allowedRoles: UserRole[];
};

function getManageRules(actorRole: UserRole, actorId: string, targetRole: UserRole, targetId: string): ManageRules {
  if (actorId === targetId) {
    return { canManageTarget: false, allowedRoles: [] };
  }

  if (actorRole === 'super_admin') {
    // Keep at least one super-admin safe from accidental lockout.
    if (targetRole === 'super_admin') {
      return { canManageTarget: false, allowedRoles: [] };
    }

    return {
      canManageTarget: true,
      allowedRoles: ['client', 'moderator', 'admin'],
    };
  }

  if (actorRole === 'admin') {
    const manageable = ['client', 'moderator'].includes(targetRole);
    return {
      canManageTarget: manageable,
      allowedRoles: manageable ? ['client', 'moderator'] : [],
    };
  }

  return { canManageTarget: false, allowedRoles: [] };
}

async function safeSyncProfileRole(
  supabase: AdminDataClient,
  payload: { id: string; role?: UserRole; disabled?: boolean }
) {
  const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' });

  // Migration may not be applied yet; skip hard failure for missing table.
  if (error && !String(error.message).toLowerCase().includes('relation') && !String(error.message).toLowerCase().includes('profiles')) {
    throw error;
  }
}

async function getAdminDataContext() {
  const actor = await requireRole(['admin', 'super_admin']);

  try {
    return {
      actor,
      supabase: createAdminClient() as AdminDataClient,
    };
  } catch {
    return {
      actor,
      supabase: (await createClient()) as AdminDataClient,
    };
  }
}

export async function getAdminOverviewStats() {
  const { supabase } = await getAdminDataContext();
  const pendingStatuses = getStatusesForModerationView('pending') ?? [];
  const approvedStatuses = getStatusesForModerationView('approved') ?? [];
  const rejectedStatuses = getStatusesForModerationView('rejected') ?? [];
  const activeStatuses = getStatusesForModerationView('active') ?? [];

  const [
    { count: totalUsers },
    { count: totalAds },
    { count: pendingAds },
    { count: approvedAds },
    { count: rejectedAds },
    { count: activeAds },
  ] = await Promise.all([
    supabase.from('users').select('id', { count: 'exact', head: true }),
    supabase.from('ads').select('id', { count: 'exact', head: true }).eq('is_deleted', false),
    supabase
      .from('ads')
      .select('id', { count: 'exact', head: true })
      .eq('is_deleted', false)
      .in('status', pendingStatuses),
    supabase
      .from('ads')
      .select('id', { count: 'exact', head: true })
      .eq('is_deleted', false)
      .in('status', approvedStatuses),
    supabase
      .from('ads')
      .select('id', { count: 'exact', head: true })
      .eq('is_deleted', false)
      .in('status', rejectedStatuses),
    supabase
      .from('ads')
      .select('id', { count: 'exact', head: true })
      .eq('is_deleted', false)
      .in('status', activeStatuses),
  ]);

  return {
    totalUsers: totalUsers ?? 0,
    totalAds: totalAds ?? 0,
    pendingAds: pendingAds ?? 0,
    approvedAds: approvedAds ?? 0,
    rejectedAds: rejectedAds ?? 0,
    activeAds: activeAds ?? 0,
  };
}

export async function listAdminUsers() {
  const { actor, supabase } = await getAdminDataContext();

  const { data, error } = await supabase
    .from('users')
    .select('id, full_name, email, role, created_at, deleted_at')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []).map((user: any) => {
    const userRole = user.role as UserRole;
    const rules = getManageRules(actor.role, actor.id, userRole, user.id);

    return {
      id: user.id,
      name: user.full_name,
      email: user.email,
      role: userRole,
      created_at: user.created_at,
      disabled: Boolean(user.deleted_at),
      can_manage: rules.canManageTarget,
      assignable_roles: rules.allowedRoles,
    };
  });
}

export async function updateAdminUserRole(userId: string, role: UserRole) {
  const { actor, supabase } = await getAdminDataContext();

  const { data: target, error: targetError } = await supabase
    .from('users')
    .select('id, role')
    .eq('id', userId)
    .single();

  if (targetError || !target) {
    throw new Error('Target user not found');
  }

  const rules = getManageRules(actor.role, actor.id, target.role as UserRole, target.id);
  if (!rules.canManageTarget) {
    throw new Error('You are not allowed to manage this user');
  }

  if (!rules.allowedRoles.includes(role)) {
    throw new Error('You are not allowed to assign this role');
  }

  const { error } = await supabase.from('users').update({ role }).eq('id', userId);
  if (error) throw error;

  // Keep profiles role in sync if profiles table is used.
  await safeSyncProfileRole(supabase, { id: userId, role });

  return { id: userId, role };
}

export async function disableAdminUser(userId: string) {
  const { actor, supabase } = await getAdminDataContext();
  const now = new Date().toISOString();

  const { data: target, error: targetError } = await supabase
    .from('users')
    .select('id, role')
    .eq('id', userId)
    .single();

  if (targetError || !target) {
    throw new Error('Target user not found');
  }

  const rules = getManageRules(actor.role, actor.id, target.role as UserRole, target.id);
  if (!rules.canManageTarget) {
    throw new Error('You are not allowed to disable this user');
  }

  const { error } = await supabase.from('users').update({ deleted_at: now }).eq('id', userId);
  if (error) throw error;

  await safeSyncProfileRole(supabase, { id: userId, disabled: true });

  return { id: userId, disabled: true };
}

export async function listAdminAds(filter: AdminViewStatus = 'all') {
  const { supabase } = await getAdminDataContext();

  let query = supabase
    .from('ads')
    .select('id, title, slug, status, created_at, review_note, reviewed_at, user:users(email, full_name)')
    .eq('is_deleted', false)
    .order('created_at', { ascending: false });

  const statuses = getStatusesForModerationView(filter);
  if (statuses) {
    query = query.in('status', statuses);
  }

  const { data, error } = await query;
  if (error) throw error;

  return data ?? [];
}

function normalizeAdStatusForWrite(status: string) {
  const map: Record<string, string> = {
    pending: 'submitted',
    approved: 'payment_pending',
    rejected: 'archived',
    active: 'published',
  };

  return map[status] ?? status;
}

export async function updateAdminAdStatus(adId: string, status: string) {
  const { actor, supabase } = await getAdminDataContext();
  const nextStatus = normalizeAdStatusForWrite(status);

  const { data: ad, error: readError } = await supabase
    .from('ads')
    .select('id, status')
    .eq('id', adId)
    .single();

  if (readError || !ad) throw new Error('Ad not found');

  const { error } = await supabase
    .from('ads')
    .update({ status: nextStatus, reviewed_by: actor.id, reviewed_at: new Date().toISOString() })
    .eq('id', adId);

  if (error) throw error;

  await supabase.from('ad_status_history').insert({
    ad_id: adId,
    from_status: ad.status,
    to_status: nextStatus,
    changed_by: actor.id,
    notes: 'Updated by admin panel',
  });

  return { id: adId, status: nextStatus };
}

export async function deleteAdminAd(adId: string) {
  const { supabase } = await getAdminDataContext();

  const { error } = await supabase.from('ads').update({ is_deleted: true }).eq('id', adId);
  if (error) throw error;

  return { id: adId, deleted: true };
}
