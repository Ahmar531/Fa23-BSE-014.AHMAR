import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Database health check endpoint
 * Logs heartbeat every 6 hours
 */
export async function GET() {
  try {
    const startTime = Date.now();
    const supabase = createAdminClient();

    // Simple query to check DB connectivity
    const { error } = await supabase.from('system_health_logs').select('id').limit(1);

    if (error) throw error;

    const duration = Date.now() - startTime;

    // Log heartbeat
    await supabase.from('system_health_logs').insert({
      check_type: 'db_heartbeat',
      status: 'ok',
      message: 'Database connection healthy',
      duration_ms: duration,
    });

    return NextResponse.json({
      status: 'ok',
      duration_ms: duration,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
