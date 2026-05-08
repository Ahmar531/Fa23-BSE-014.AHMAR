import type { AdStatus, UserRole } from '@/lib/types';
import { ROLE_HOME } from '@/lib/roles';

export const STATUS_TRANSITIONS: Record<AdStatus, AdStatus[]> = {
  draft: ['submitted', 'archived'],
  submitted: ['under_review', 'archived'],
  under_review: ['payment_pending', 'archived'],
  payment_pending: ['payment_submitted', 'archived'],
  payment_submitted: ['payment_verified', 'payment_pending', 'archived'],
  payment_verified: ['scheduled', 'published', 'archived'],
  scheduled: ['published', 'archived'],
  published: ['expired', 'archived'],
  expired: ['archived'],
  archived: [],
};

export const ROLE_DASHBOARD: Record<UserRole, string> = ROLE_HOME;

export function canTransition(current: AdStatus, next: AdStatus) {
  return STATUS_TRANSITIONS[current]?.includes(next) ?? false;
}

export function assertTransition(current: AdStatus, next: AdStatus) {
  if (!canTransition(current, next)) {
    throw new Error(`Invalid ad status transition: ${current} -> ${next}`);
  }
}
