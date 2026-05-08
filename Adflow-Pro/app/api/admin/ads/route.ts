import { fail, getErrorStatus, ok } from '@/lib/api';
import { listAdminAds } from '@/lib/admin-module';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = (searchParams.get('status') ?? 'all') as 'all' | 'pending' | 'approved' | 'rejected' | 'active';
    return ok(await listAdminAds(status));
  } catch (error) {
    return fail(error instanceof Error ? error.message : 'Failed to load ads', getErrorStatus(error, 500));
  }
}
