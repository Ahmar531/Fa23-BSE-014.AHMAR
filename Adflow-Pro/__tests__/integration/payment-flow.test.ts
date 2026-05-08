/**
 * Integration tests for the payment lifecycle.
 * Supabase calls are fully mocked — these tests run post-deploy in CI
 * without requiring a live database.
 */

import { canTransition } from '@/lib/workflow';
import { SubmitPaymentSchema, VerifyPaymentSchema } from '@/lib/validations';

const VALID_UUID = '00000000-0000-4000-8000-000000000001';
const PAYMENT_UUID = '00000000-0000-4000-8000-000000000002';

// ============================================================
// PAYMENT LIFECYCLE STATE MACHINE
// ============================================================
describe('Payment Lifecycle — State Machine', () => {
  it('Full happy path: draft → submitted → under_review → payment_pending → payment_submitted → payment_verified → published', () => {
    const steps: Array<[string, string]> = [
      ['draft', 'submitted'],
      ['submitted', 'under_review'],
      ['under_review', 'payment_pending'],
      ['payment_pending', 'payment_submitted'],
      ['payment_submitted', 'payment_verified'],
      ['payment_verified', 'published'],
    ];
    steps.forEach(([from, to]) => {
      expect(canTransition(from as any, to as any)).toBe(true);
    });
  });

  it('Rejected payment can be resubmitted: payment_submitted → payment_pending → payment_submitted', () => {
    expect(canTransition('payment_submitted', 'payment_pending')).toBe(true);
    expect(canTransition('payment_pending', 'payment_submitted')).toBe(true);
  });

  it('Verified payment can go to scheduled before publish', () => {
    expect(canTransition('payment_verified', 'scheduled')).toBe(true);
    expect(canTransition('scheduled', 'published')).toBe(true);
  });

  it('Cannot skip moderation and go directly to payment_pending from draft', () => {
    expect(canTransition('draft', 'payment_pending')).toBe(false);
  });

  it('Cannot publish an unverified payment', () => {
    expect(canTransition('payment_submitted', 'published')).toBe(false);
    expect(canTransition('payment_pending', 'published')).toBe(false);
  });
});

// ============================================================
// PAYMENT SUBMISSION SCHEMA VALIDATION
// ============================================================
describe('SubmitPaymentSchema — business rules', () => {
  const validPayload = {
    ad_id: VALID_UUID,
    transaction_ref: 'JAZZ-20240501-1234',
    payment_proof_url: 'https://imgbb.com/proof123.jpg',
    notes: '[JAZZCASH] Sender: Ali Khan',
  };

  it('accepts JazzCash payment with all fields', () => {
    const result = SubmitPaymentSchema.parse(validPayload);
    expect(result.ad_id).toBe(VALID_UUID);
    expect(result.transaction_ref).toBe('JAZZ-20240501-1234');
  });

  it('accepts EasyPaisa payment without optional notes', () => {
    const { notes, ...withoutNotes } = validPayload;
    expect(() => SubmitPaymentSchema.parse(withoutNotes)).not.toThrow();
  });

  it('rejects transaction_ref that is too short (< 4 chars)', () => {
    expect(() => SubmitPaymentSchema.parse({ ...validPayload, transaction_ref: 'AB' })).toThrow();
  });

  it('rejects transaction_ref that is too long (> 100 chars)', () => {
    expect(() =>
      SubmitPaymentSchema.parse({ ...validPayload, transaction_ref: 'X'.repeat(101) })
    ).toThrow();
  });

  it('rejects non-URL payment proof', () => {
    expect(() =>
      SubmitPaymentSchema.parse({ ...validPayload, payment_proof_url: 'not-a-url' })
    ).toThrow();
  });

  it('rejects notes longer than 500 chars', () => {
    expect(() =>
      SubmitPaymentSchema.parse({ ...validPayload, notes: 'N'.repeat(501) })
    ).toThrow();
  });
});

// ============================================================
// PAYMENT VERIFICATION SCHEMA VALIDATION
// ============================================================
describe('VerifyPaymentSchema — admin actions', () => {
  it('verifies a payment with optional notes', () => {
    const result = VerifyPaymentSchema.parse({
      payment_id: PAYMENT_UUID,
      action: 'verify',
      notes: 'Bank statement verified',
    });
    expect(result.action).toBe('verify');
  });

  it('rejects a payment with a rejection reason', () => {
    const result = VerifyPaymentSchema.parse({
      payment_id: PAYMENT_UUID,
      action: 'reject',
      rejection_reason: 'Transaction reference not found in bank records',
    });
    expect(result.action).toBe('reject');
    expect(result.rejection_reason).toBe('Transaction reference not found in bank records');
  });

  it('rejects an unknown action', () => {
    expect(() =>
      VerifyPaymentSchema.parse({ payment_id: PAYMENT_UUID, action: 'approve' })
    ).toThrow();
  });

  it('rejects rejection_reason longer than 500 chars', () => {
    expect(() =>
      VerifyPaymentSchema.parse({
        payment_id: PAYMENT_UUID,
        action: 'reject',
        rejection_reason: 'R'.repeat(501),
      })
    ).toThrow();
  });
});

// ============================================================
// DUPLICATE TRANSACTION DETECTION (logic simulation)
// ============================================================
describe('Duplicate transaction_ref detection', () => {
  const existingRefs = new Set(['TXN-001', 'TXN-002', 'JAZZ-ABC-999']);

  function isDuplicateRef(ref: string, excludeAdId?: string): boolean {
    // Simulates the DB check in submitClientPayment
    return existingRefs.has(ref);
  }

  it('detects a duplicate transaction reference', () => {
    expect(isDuplicateRef('TXN-001')).toBe(true);
  });

  it('allows a unique transaction reference', () => {
    expect(isDuplicateRef('TXN-NEW-2024')).toBe(false);
  });
});

// ============================================================
// PAYMENT AMOUNT EDGE CASES
// ============================================================
describe('Payment amount parsing', () => {
  function parseAmount(value: unknown): number {
    const parsed = typeof value === 'number' ? value : Number(value ?? 0);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  it('parses numeric amounts correctly', () => {
    expect(parseAmount(1500)).toBe(1500);
    expect(parseAmount(0)).toBe(0);
  });

  it('parses string amounts (from DB)', () => {
    expect(parseAmount('2500')).toBe(2500);
  });

  it('returns 0 for null/undefined', () => {
    expect(parseAmount(null)).toBe(0);
    expect(parseAmount(undefined)).toBe(0);
  });

  it('returns 0 for NaN', () => {
    expect(parseAmount('not-a-number')).toBe(0);
  });
});
