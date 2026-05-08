/**
 * Unit tests for ad status workflow transitions
 * These tests run post-deploy and validate business logic without hitting Supabase.
 */
import { canTransition, assertTransition, STATUS_TRANSITIONS } from '@/lib/workflow';
import type { AdStatus } from '@/lib/types';

describe('STATUS_TRANSITIONS — complete map', () => {
  it('covers all known ad statuses', () => {
    const allStatuses: AdStatus[] = [
      'draft', 'submitted', 'under_review',
      'payment_pending', 'payment_submitted', 'payment_verified',
      'scheduled', 'published', 'expired', 'archived',
    ];
    allStatuses.forEach((status) => {
      expect(STATUS_TRANSITIONS).toHaveProperty(status);
    });
  });
});

describe('canTransition()', () => {
  // --- Happy path ---
  const validPaths: [AdStatus, AdStatus][] = [
    ['draft', 'submitted'],
    ['draft', 'archived'],
    ['submitted', 'under_review'],
    ['submitted', 'archived'],
    ['under_review', 'payment_pending'],
    ['under_review', 'archived'],
    ['payment_pending', 'payment_submitted'],
    ['payment_pending', 'archived'],
    ['payment_submitted', 'payment_verified'],
    ['payment_submitted', 'payment_pending'],   // payment rejected → back to pending
    ['payment_submitted', 'archived'],
    ['payment_verified', 'scheduled'],
    ['payment_verified', 'published'],
    ['payment_verified', 'archived'],
    ['scheduled', 'published'],
    ['scheduled', 'archived'],
    ['published', 'expired'],
    ['published', 'archived'],
    ['expired', 'archived'],
  ];

  validPaths.forEach(([from, to]) => {
    it(`allows ${from} → ${to}`, () => {
      expect(canTransition(from, to)).toBe(true);
    });
  });

  // --- Invalid / blocked paths ---
  const blockedPaths: [AdStatus, AdStatus][] = [
    ['draft', 'published'],
    ['draft', 'payment_pending'],
    ['submitted', 'published'],
    ['under_review', 'draft'],
    ['payment_pending', 'published'],
    ['payment_submitted', 'scheduled'],
    ['published', 'draft'],
    ['expired', 'published'],
    ['archived', 'draft'],
    ['archived', 'published'],
  ];

  blockedPaths.forEach(([from, to]) => {
    it(`blocks ${from} → ${to}`, () => {
      expect(canTransition(from, to)).toBe(false);
    });
  });
});

describe('assertTransition()', () => {
  it('does not throw for a valid transition', () => {
    expect(() => assertTransition('draft', 'submitted')).not.toThrow();
    expect(() => assertTransition('payment_submitted', 'payment_verified')).not.toThrow();
  });

  it('throws for an invalid transition', () => {
    expect(() => assertTransition('draft', 'published')).toThrow('Invalid ad status transition');
    expect(() => assertTransition('archived', 'draft')).toThrow('Invalid ad status transition');
  });

  it('error message contains both statuses', () => {
    expect(() => assertTransition('expired', 'published')).toThrow('expired -> published');
  });
});
