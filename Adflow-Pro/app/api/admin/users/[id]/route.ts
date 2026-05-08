import { fail, getErrorStatus, ok } from '@/lib/api';
import { disableAdminUser, updateAdminUserRole } from '@/lib/admin-module';
import type { UserRole } from '@/lib/types';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = (await request.json()) as { action?: 'role' | 'disable'; role?: UserRole };

    if (body.action === 'disable') {
      return ok(await disableAdminUser(params.id));
    }

    if (!body.role) {
      return fail('Role is required', 400);
    }

    return ok(await updateAdminUserRole(params.id, body.role));
  } catch (error) {
    return fail(error instanceof Error ? error.message : 'Failed to update user', getErrorStatus(error, 400));
  }
}
