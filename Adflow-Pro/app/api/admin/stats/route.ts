import { fail, getErrorStatus, ok } from '@/lib/api';
import { getAdminOverviewStats } from '@/lib/admin-module';

export async function GET() {
  try {
    return ok(await getAdminOverviewStats());
  } catch (error) {
    return fail(error instanceof Error ? error.message : 'Failed to load admin stats', getErrorStatus(error, 500));
  }
}
