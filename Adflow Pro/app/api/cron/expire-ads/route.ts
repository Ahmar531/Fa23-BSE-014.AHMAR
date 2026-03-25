import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { addDays } from 'date-fns';

/**
 * Cron job to expire ads and send expiry reminders
 * Run daily via Vercel Cron
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

    // Expire ads that have passed their expiry date
    const { data: expiredAds, error: fetchError } = await supabase
      .from('ads')
      .select('id, title, user_id')
      .eq('status', 'published')
      .lte('expire_at', now);

    if (fetchError) throw fetchError;

    let expiredCount = 0;
    if (expiredAds && expiredAds.length > 0) {
      const { error: updateError } = await supabase
        .from('ads')
        .update({ status: 'expired' })
        .in(
          'id',
          expiredAds.map((ad: any) => ad.id)
        );

      if (updateError) throw updateError;

      // Create notifications
      const notifications = expiredAds.map((ad: any) => ({
        user_id: ad.user_id,
        type: 'ad_expired' as const,
        title: 'Ad Expired',
        message: `Your ad "${ad.title}" has expired.`,
        ad_id: ad.id,
      }));

      await supabase.from('notifications').insert(notifications);
      expiredCount = expiredAds.length;
    }

    // Send 48h expiry reminders
    const reminderDate = addDays(new Date(), 2).toISOString();
    const { data: expiringAds, error: reminderFetchError } = await supabase
      .from('ads')
      .select('id, title, user_id, expire_at')
      .eq('status', 'published')
      .lte('expire_at', reminderDate)
      .gt('expire_at', now);

    if (reminderFetchError) throw reminderFetchError;

    let reminderCount = 0;
    if (expiringAds && expiringAds.length > 0) {
      const reminders = expiringAds.map((ad: any) => ({
        user_id: ad.user_id,
        type: 'ad_expiring_soon' as const,
        title: 'Ad Expiring Soon',
        message: `Your ad "${ad.title}" will expire in 48 hours.`,
        ad_id: ad.id,
      }));

      await supabase.from('notifications').insert(reminders);
      reminderCount = expiringAds.length;
    }

    // Log health check
    await supabase.from('system_health_logs').insert({
      check_type: 'cron_expire',
      status: 'ok',
      message: `Expired ${expiredCount} ads, sent ${reminderCount} reminders`,
      metadata: { expired: expiredCount, reminders: reminderCount },
    });

    return NextResponse.json({
      success: true,
      expired: expiredCount,
      reminders: reminderCount,
    });
  } catch (error: any) {
    console.error('Expire cron error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
