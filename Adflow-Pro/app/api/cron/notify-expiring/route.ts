import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    const url = new URL(request.url);
    const isVercel = request.headers.get('x-vercel-cron');
    if (!isVercel && !url.searchParams.has('force')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: 'Missing Supabase config' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const now = new Date();
    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    // Find published ads expiring within 3 days
    const { data: expiringAds, error } = await supabase
      .from('ads')
      .select('id, title, user_id, expires_at')
      .eq('status', 'published')
      .eq('is_deleted', false)
      .lte('expires_at', threeDaysLater.toISOString())
      .gt('expires_at', now.toISOString());

    if (error) throw error;

    let notified = 0;

    for (const ad of expiringAds ?? []) {
      const expiresAt = new Date(ad.expires_at);
      const hoursLeft = Math.round((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60));

      // Check if we already sent a notification for this ad recently
      const { data: existing } = await supabase
        .from('notifications')
        .select('id')
        .eq('ad_id', ad.id)
        .eq('type', 'ad_expiring_soon')
        .gte('created_at', new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString())
        .limit(1);

      if (existing && existing.length > 0) continue;

      await supabase.from('notifications').insert({
        user_id: ad.user_id,
        title: 'Ad Expiring Soon',
        message: `Your ad "${ad.title}" will expire in approximately ${hoursLeft} hours. Consider renewing or updating it.`,
        type: 'ad_expiring_soon',
        ad_id: ad.id,
      });

      notified++;
    }

    // Log to system_health_logs
    await supabase.from('system_health_logs').insert({
      job_name: 'notify-expiring',
      status: 'success',
      details: { notified, total_expiring: expiringAds?.length ?? 0 },
    });

    return NextResponse.json({
      success: true,
      notified,
      total_expiring: expiringAds?.length ?? 0,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';

    try {
      await supabase.from('system_health_logs').insert({
        job_name: 'notify-expiring',
        status: 'error',
        details: { error: message },
      });
    } catch (_) { /* ignore logging errors */ }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
