import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(['moderator', 'admin', 'super_admin']);
    const formData = await request.formData();
    
    const ad_id = formData.get('ad_id') as string;
    const action = formData.get('action') as string;
    const notes = formData.get('notes') as string | null;
    const rejection_reason = formData.get('rejection_reason') as string | null;

    if (!ad_id || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = await createClient();

    if (action === 'approve') {
      // Update ad status to payment_pending
      const { error: updateError } = await supabase
        .from('ads')
        .update({
          status: 'payment_pending',
          moderation_notes: notes,
        })
        .eq('id', ad_id);

      if (updateError) throw updateError;

      // Get ad details for notification
      const { data: ad } = await supabase
        .from('ads')
        .select('title, user_id')
        .eq('id', ad_id)
        .single();

      // Create notification
      if (ad) {
        await supabase.from('notifications').insert({
          user_id: ad.user_id,
          type: 'status_change',
          title: 'Ad Approved',
          message: `Your ad "${ad.title}" has been approved! Please submit payment to continue.`,
          ad_id,
        });
      }

      // Log audit
      await supabase.from('audit_logs').insert({
        actor_id: user.id,
        actor_email: user.email,
        action: 'ad_approved',
        entity_type: 'ad',
        entity_id: ad_id,
        new_data: { status: 'payment_pending', notes },
      });

      return NextResponse.redirect(new URL('/moderator', request.url));
    } else if (action === 'reject') {
      // Update ad status to archived with rejection reason
      const { error: updateError } = await supabase
        .from('ads')
        .update({
          status: 'archived',
          rejection_reason: rejection_reason || 'Does not meet quality standards',
          moderation_notes: notes,
        })
        .eq('id', ad_id);

      if (updateError) throw updateError;

      // Get ad details for notification
      const { data: ad } = await supabase
        .from('ads')
        .select('title, user_id')
        .eq('id', ad_id)
        .single();

      // Create notification
      if (ad) {
        await supabase.from('notifications').insert({
          user_id: ad.user_id,
          type: 'moderation_note',
          title: 'Ad Rejected',
          message: `Your ad "${ad.title}" was rejected. Reason: ${rejection_reason || 'Does not meet quality standards'}`,
          ad_id,
        });
      }

      // Log audit
      await supabase.from('audit_logs').insert({
        actor_id: user.id,
        actor_email: user.email,
        action: 'ad_rejected',
        entity_type: 'ad',
        entity_id: ad_id,
        new_data: { status: 'archived', rejection_reason, notes },
      });

      return NextResponse.redirect(new URL('/moderator', request.url));
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Review error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
