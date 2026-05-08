import type { AdStatus } from '@/lib/types';

export type ModerationView = 'all' | 'pending' | 'approved' | 'rejected' | 'active';

export const MODERATION_STATUS_GROUPS: Record<Exclude<ModerationView, 'all'>, AdStatus[]> = {
  pending: ['submitted', 'under_review'],
  approved: ['payment_pending', 'payment_submitted', 'payment_verified', 'scheduled'],
  rejected: ['archived'],
  active: ['published'],
};

export function getStatusesForModerationView(view: ModerationView) {
  return view === 'all' ? null : MODERATION_STATUS_GROUPS[view];
}

export function getModerationViewForStatus(status: string | null | undefined): Exclude<ModerationView, 'all'> | null {
  if (!status) return null;

  for (const [view, statuses] of Object.entries(MODERATION_STATUS_GROUPS) as Array<
    [Exclude<ModerationView, 'all'>, AdStatus[]]
  >) {
    if (statuses.includes(status as AdStatus)) {
      return view;
    }
  }

  return null;
}

export function isPendingModerationStatus(status: string | null | undefined) {
  return MODERATION_STATUS_GROUPS.pending.includes(status as AdStatus);
}
