import { fail, getErrorStatus, ok } from '@/lib/api';
import { getModeratorQueue } from '@/lib/marketplace';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = (searchParams.get('status') ?? 'pending') as
      | 'pending'
      | 'approved'
      | 'rejected'
      | 'all';

    return ok(await getModeratorQueue(status));
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : 'Failed to load review queue',
      getErrorStatus(error, 500)
    );
  }
}
