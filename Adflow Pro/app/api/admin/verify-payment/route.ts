import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { addDays } from 'date-fns';

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(['admin', 'super_admin']);
    const formData = await request.formData();
    
    const payment_id = formData.get('payment_id') as string;
    const action = formData.get('action') as string;
    const rejection_reason = formData.get('rejection_reason') as string | null;
    const notes = formData.get('notes') as string | null;

    if (!payment_id || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = await createClient();

    // Get payment details
    const { data: payment } = await supabase
      .from('payments')
      .select('*, ad:ads(id, title, user_id, package_id), package:packages(*)')
      .eq('id', payment_id)
      .single();

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    if (action === 'verify') {
      // Update payment status
      const { error: paymentError } = await supabase
        .from('payments')
        .update({
          status: 'verified',
          verified_at: new Date().toISOString(),
          verified_by: user.id,
          notes,
        })
        .eq('id', payment_id);

      if (paymentError) throw paymentError;

      // Calculate expiry date
      const publishAt = new Date();
      const expireAt = addDays(publishAt, payment.package.duration_days);

      // Update ad status to payment_verified
      const { error: adError } = await supabase
        .from('ads')
        .update({
          status: 'payment_verified',
          publish_at: publishAt.toISOString(),
          expire_at: expireAt.toISOString(),
        })
        .eq('id', payment.ad.id);

      if (adError) throw adError;

      // Create notification
      await supabase.from('notifications').insert({
        user_id: payment.ad.user_id,
        type: 'payment_verified',
        title: 'Payment Verified',
        message: `Your payment for "${payment.ad.title}" has been verified! Your ad will be published soon.`,
        ad_id: payment.ad.id,
      });

      // Log audit
      await supabase.from('audit_logs').insert({
        actor_id: user.id,
        actor_email: user.email,
        action: 'payment_verified',
        entity_type: 'payment',
        entity_id: payment_id,
        new_data: { status: 'verified', notes },
      });

      return NextResponse.redirect(new URL('/admin', request.url));
    } else if (action === 'reject') {
      // Update payment status
      const { error: paymentError } = await supabase
        .from('payments')
        .update({
          status: 'rejected',
          rejection_reason: rejection_reason || 'Payment verification failed',
          notes,
        })
        .eq('id', payment_id);

      if (paymentError) throw paymentError;

      // Update ad status back to payment_pending
      const { error: adError } = await supabase
        .from('ads')
        .update({
          status: 'payment_pending',
        })
        .eq('id', payment.ad.id);

      if (adError) throw adError;

      // Create notification
      await supabase.from('notifications').insert({
        user_id: payment.ad.user_id,
        type: 'payment_rejected',
        title: 'Payment Rejected',
        message: `Your payment for "${payment.ad.title}" was rejected. Reason: ${rejection_reason || 'Payment verification failed'}. Please resubmit.`,
        ad_id: payment.ad.id,
      });

      // Log audit
      await supabase.from('audit_logs').insert({
        actor_id: user.id,
        actor_email: user.email,
        action: 'payment_rejected',
        entity_type: 'payment',
        entity_id: payment_id,
        new_data: { status: 'rejected', rejection_reason, notes },
      });

      return NextResponse.redirect(new URL('/admin', request.url));
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
