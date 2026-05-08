/**
 * Unit tests for all Zod validation schemas.
 * These run entirely in-memory, no DB or network calls.
 */
import {
  LoginSchema,
  RegisterSchema,
  CreateAdSchema,
  UpdateAdSchema,
  SubmitPaymentSchema,
  VerifyPaymentSchema,
  ReviewAdSchema,
  ScheduleAdSchema,
  SearchSchema,
} from '@/lib/validations';

const VALID_UUID = '00000000-0000-4000-8000-000000000001';

// ============================================================
// AUTH
// ============================================================
describe('LoginSchema', () => {
  it('accepts valid credentials', () => {
    expect(() => LoginSchema.parse({ email: 'u@example.com', password: 'Secret123' })).not.toThrow();
  });
  it('rejects invalid email', () => {
    expect(() => LoginSchema.parse({ email: 'not-an-email', password: 'Secret123' })).toThrow();
  });
  it('rejects short password', () => {
    expect(() => LoginSchema.parse({ email: 'u@example.com', password: '1234567' })).toThrow();
  });
});

describe('RegisterSchema', () => {
  const valid = { email: 'u@example.com', password: 'Secret123', full_name: 'Ali Khan' };
  it('accepts valid registration', () => {
    expect(() => RegisterSchema.parse(valid)).not.toThrow();
  });
  it('rejects missing full_name', () => {
    expect(() => RegisterSchema.parse({ ...valid, full_name: undefined })).toThrow();
  });
  it('rejects full_name that is too short', () => {
    expect(() => RegisterSchema.parse({ ...valid, full_name: 'A' })).toThrow();
  });
});

// ============================================================
// ADS
// ============================================================
describe('CreateAdSchema', () => {
  const valid = {
    title: 'This is a valid ad title',
    description: 'A'.repeat(50),
    category_id: VALID_UUID,
    city_id: VALID_UUID,
    package_id: VALID_UUID,
    contact_email: 'seller@example.com',
    media_urls: ['https://example.com/image.jpg'],
  };

  it('accepts a complete valid ad', () => {
    expect(() => CreateAdSchema.parse(valid)).not.toThrow();
  });

  it('rejects title shorter than 10 chars', () => {
    expect(() => CreateAdSchema.parse({ ...valid, title: 'Short' })).toThrow();
  });

  it('rejects description shorter than 50 chars', () => {
    expect(() => CreateAdSchema.parse({ ...valid, description: 'Too short' })).toThrow();
  });

  it('rejects invalid category_id (not UUID)', () => {
    expect(() => CreateAdSchema.parse({ ...valid, category_id: 'not-a-uuid' })).toThrow();
  });

  it('rejects empty media_urls array', () => {
    expect(() => CreateAdSchema.parse({ ...valid, media_urls: [] })).toThrow();
  });

  it('rejects non-https media URL', () => {
    expect(() => CreateAdSchema.parse({ ...valid, media_urls: ['http://example.com/img.jpg'] })).toThrow();
  });

  it('accepts optional fields as undefined', () => {
    const { contact_phone, website_url, price, ...rest } = valid as any;
    expect(() => CreateAdSchema.parse(rest)).not.toThrow();
  });
});

describe('UpdateAdSchema', () => {
  it('accepts partial fields + id', () => {
    expect(() => UpdateAdSchema.parse({ id: VALID_UUID, title: 'Updated title here!' })).not.toThrow();
  });
  it('rejects missing id', () => {
    expect(() => UpdateAdSchema.parse({ title: 'Updated title here!' })).toThrow();
  });
});

// ============================================================
// PAYMENTS
// ============================================================
describe('SubmitPaymentSchema', () => {
  const valid = {
    ad_id: VALID_UUID,
    transaction_ref: 'TXN-12345',
    payment_proof_url: 'https://example.com/proof.jpg',
  };
  it('accepts valid payment submission', () => {
    expect(() => SubmitPaymentSchema.parse(valid)).not.toThrow();
  });
  it('rejects transaction_ref shorter than 4 chars', () => {
    expect(() => SubmitPaymentSchema.parse({ ...valid, transaction_ref: 'AB' })).toThrow();
  });
  it('rejects invalid payment_proof_url', () => {
    expect(() => SubmitPaymentSchema.parse({ ...valid, payment_proof_url: 'not-a-url' })).toThrow();
  });
  it('accepts optional notes', () => {
    expect(() => SubmitPaymentSchema.parse({ ...valid, notes: 'JazzCash payment' })).not.toThrow();
  });
});

describe('VerifyPaymentSchema', () => {
  const base = { payment_id: VALID_UUID, action: 'verify' as const };
  it('accepts verify action', () => {
    expect(() => VerifyPaymentSchema.parse(base)).not.toThrow();
  });
  it('accepts reject action with reason', () => {
    expect(() => VerifyPaymentSchema.parse({ ...base, action: 'reject', rejection_reason: 'Duplicate ref' })).not.toThrow();
  });
  it('rejects unknown action', () => {
    expect(() => VerifyPaymentSchema.parse({ ...base, action: 'approve' })).toThrow();
  });
});

// ============================================================
// MODERATION
// ============================================================
describe('ReviewAdSchema', () => {
  const base = { ad_id: VALID_UUID, action: 'approve' as const };
  it('accepts approve action', () => {
    expect(() => ReviewAdSchema.parse(base)).not.toThrow();
  });
  it('accepts reject action with reason', () => {
    expect(() => ReviewAdSchema.parse({ ...base, action: 'reject', rejection_reason: 'Misleading content' })).not.toThrow();
  });
  it('rejects missing action', () => {
    expect(() => ReviewAdSchema.parse({ ad_id: VALID_UUID })).toThrow();
  });
  it('rejects invalid action value', () => {
    expect(() => ReviewAdSchema.parse({ ...base, action: 'suspend' })).toThrow();
  });
});

describe('ScheduleAdSchema', () => {
  const valid = {
    ad_id: VALID_UUID,
    publish_at: new Date(Date.now() + 86400000).toISOString(),
    is_featured: false,
    admin_boost: 0,
  };
  it('accepts valid schedule input', () => {
    expect(() => ScheduleAdSchema.parse(valid)).not.toThrow();
  });
  it('rejects admin_boost over 100', () => {
    expect(() => ScheduleAdSchema.parse({ ...valid, admin_boost: 101 })).toThrow();
  });
  it('rejects invalid datetime string', () => {
    expect(() => ScheduleAdSchema.parse({ ...valid, publish_at: 'not-a-date' })).toThrow();
  });
});

// ============================================================
// SEARCH
// ============================================================
describe('SearchSchema', () => {
  it('parses defaults when no params given', () => {
    const result = SearchSchema.parse({});
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(12);
    expect(result.sort).toBe('rank_score');
  });

  it('coerces string page/pageSize to numbers', () => {
    const result = SearchSchema.parse({ page: '3', pageSize: '24' });
    expect(result.page).toBe(3);
    expect(result.pageSize).toBe(24);
  });

  it('rejects pageSize over 50', () => {
    expect(() => SearchSchema.parse({ pageSize: 100 })).toThrow();
  });
});
