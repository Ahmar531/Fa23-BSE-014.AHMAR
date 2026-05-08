export const dynamic = 'force-dynamic';

import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Rocket, Star, TrendingUp } from 'lucide-react';
import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdminScheduleForm } from '@/components/admin-schedule-form';
import { StatusPill } from '@/components/status-pill';
import { formatCurrency } from '@/lib/utils';

export default async function AdminAdSchedulePage({ params }: { params: { id: string } }) {
  const user = await requireRole(['admin', 'super_admin']);
  const supabase = await createClient();

  const { data: ad } = await supabase
    .from('ads')
    .select(`
      *,
      package:packages(*),
      category:categories(*),
      city:cities(*),
      user:users(email, full_name),
      media:ad_media(*)
    `)
    .eq('id', params.id)
    .single();

  if (!ad) notFound();

  return (
    <div className="space-y-6">
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-slate-600 transition hover:text-slate-950">
        <ArrowLeft className="h-4 w-4" />
        Back to Admin Dashboard
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Ad Details */}
        <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-3">
              <StatusPill status={ad.status} />
              {ad.is_featured ? (
                <Badge className="rounded-full bg-orange-100 text-orange-700 hover:bg-orange-100">
                  <Star className="mr-1 h-3 w-3" /> Featured
                </Badge>
              ) : null}
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">{ad.title}</h1>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.25rem] bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Category</p>
                <p className="mt-1 font-medium text-slate-900">{ad.category?.name || 'N/A'}</p>
              </div>
              <div className="rounded-[1.25rem] bg-slate-50 p-4">
                <p className="text-xs text-slate-500">City</p>
                <p className="mt-1 font-medium text-slate-900">{ad.city?.name || 'N/A'}</p>
              </div>
              <div className="rounded-[1.25rem] bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Package</p>
                <p className="mt-1 font-medium text-slate-900">
                  {ad.package?.name || 'N/A'} ({ad.package?.duration_days || 0} days)
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-[1.25rem] bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Owner</p>
              <p className="mt-1 font-medium text-slate-900">{ad.user?.full_name || ad.user?.email || 'Unknown'}</p>
            </div>

            <div className="mt-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Description</p>
              <p className="mt-2 text-sm leading-7 text-slate-600 whitespace-pre-wrap">{ad.description}</p>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <p className="text-xs text-slate-500">Views</p>
                <p className="mt-1 text-lg font-semibold">{ad.view_count}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <p className="text-xs text-slate-500">Clicks</p>
                <p className="mt-1 text-lg font-semibold">{ad.click_count}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <p className="text-xs text-slate-500">Rank</p>
                <p className="mt-1 text-lg font-semibold">{Math.round(Number(ad.rank_score ?? 0))}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Form */}
        <div className="space-y-6">
          <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-orange-100 p-2">
                  <Calendar className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Scheduling</p>
                  <h2 className="mt-1 text-xl font-semibold">Schedule or Publish</h2>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600">
                Set a future publish date to schedule, or pick now to publish immediately. Featured ads appear at the top of marketplace listings.
              </p>
              <div className="mt-5">
                <AdminScheduleForm adId={ad.id} />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <CardContent className="p-6">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Rank Factors</p>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-700">Featured Bonus</span>
                  <span className="font-semibold">{ad.is_featured ? '+50' : '0'}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-700">Package Weight</span>
                  <span className="font-semibold">×{ad.package?.featured_weight ?? 1}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-700">Admin Boost</span>
                  <span className="font-semibold">+{ad.admin_boost ?? 0}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-700">Current Rank Score</span>
                  <span className="text-lg font-bold text-orange-600">{Math.round(Number(ad.rank_score ?? 0))}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
