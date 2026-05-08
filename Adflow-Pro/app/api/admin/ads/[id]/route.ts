import { fail, getErrorStatus, ok } from '@/lib/api';
import { deleteAdminAd, updateAdminAdStatus } from '@/lib/admin-module';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = (await request.json()) as { status?: string };
    if (!body.status) return fail('Status is required', 400);
    return ok(await updateAdminAdStatus(params.id, body.status));
  } catch (error) {
    return fail(error instanceof Error ? error.message : 'Failed to update ad', getErrorStatus(error, 400));
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    return ok(await deleteAdminAd(params.id));
  } catch (error) {
    return fail(error instanceof Error ? error.message : 'Failed to delete ad', getErrorStatus(error, 400));
  }
}
