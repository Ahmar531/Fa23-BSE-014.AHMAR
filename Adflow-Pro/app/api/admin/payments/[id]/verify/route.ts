import { fail, ok } from '@/lib/api';
import { verifyAdminPayment } from '@/lib/marketplace';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    return ok(await verifyAdminPayment(params.id, body));
  } catch (error) {
    return fail(error instanceof Error ? error.message : 'Failed to verify payment', 400);
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const formData = await request.formData();
    const action = formData.get('action') as string;
    const rejectionReason = formData.get('rejection_reason');
    const notes = formData.get('notes');
    const body = {
      action,
      rejection_reason: rejectionReason ? String(rejectionReason) : undefined,
      notes: notes ? String(notes) : undefined,
    };
    await verifyAdminPayment(params.id, body);

    // Redirect back to admin dashboard
    return new Response(null, {
      status: 303,
      headers: { Location: '/admin' },
    });
  } catch (error) {
    return fail(error instanceof Error ? error.message : 'Failed to verify payment', 400);
  }
}
