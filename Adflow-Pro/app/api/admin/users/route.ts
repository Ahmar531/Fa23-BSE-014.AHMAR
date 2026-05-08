import { fail, getErrorStatus, ok } from '@/lib/api';
import { listAdminUsers } from '@/lib/admin-module';

export async function GET() {
  try {
    return ok(await listAdminUsers());
  } catch (error) {
    return fail(error instanceof Error ? error.message : 'Failed to load users', getErrorStatus(error, 500));
  }
}
