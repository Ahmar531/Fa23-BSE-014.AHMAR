import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Cron job to publish scheduled ads
 * Run every hour via Vercel Cron
 */
export async function GET(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();
    const now = new Date().toISOString();

    // Find ads that are scheduled and ready to publish
    const { data: scheduledAds, error: fetchError } = await supabase
      .from('ads')
      .select('id, title, user_id, expire_at, package_id')
      .eq('status', 'scheduled')
      .lte('publish_at', now);

    if (fetchError) throw fetchError;

    if (!scheduledAds || scheduledAds.length === 0) {
      return NextResponse.json({ message: 'No ads to publish', count: 0 });
    }

    // Update ads to published status
    const { error: updateError } = await supabase
      .from('ads')
      .update({ status: 'published' })
      .in(
        'id',
        scheduledAds.map((ad: any) => ad.id)
      );

    if (updateError) throw updateError;

    // Create notifications for each published ad
    const notifications = scheduledAds.map((ad: any) => ({
      user_id: ad.user_id,
      type: 'status_change' as const,
      title: 'Ad Published',
      message: `Your ad "${ad.title}" is now live!`,
      ad_id: ad.id,
    }));

    await supabase.from('notifications').insert(notifications);

    // Log health check
    await supabase.from('system_health_logs').insert({
      check_type: 'cron_publish',
      status: 'ok',
      message: `Published ${scheduledAds.length} ads`,
      metadata: { count: scheduledAds.length },
    });

    return NextResponse.json({
      success: true,
      published: scheduledAds.length,
      ads: scheduledAds.map((ad: any) => ad.id),
    });
  } catch (error: any) {
    console.error('Publish cron error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
