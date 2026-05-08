export const dynamic = 'force-dynamic';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getAdminAnalyticsSummary } from '@/lib/dashboard';
import { formatCurrency } from '@/lib/utils';
import {
  BarChart3,
  FileText,
  Layers3,
  PieChart,
  Rocket,
  TrendingUp,
  Clock3,
} from 'lucide-react';

export default async function AdminAnalyticsPage() {
  const summary = await getAdminAnalyticsSummary();

  return (
    <div className="space-y-6">
      {/* Section 1 — Listings Summary */}
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Listings Summary</p>
        <h2 className="mt-2 text-2xl font-semibold">Marketplace Overview</h2>
      </div>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total Ads', value: summary.totalAds, icon: Layers3, color: 'text-slate-600', bg: 'bg-slate-100' },
          { label: 'Active', value: summary.activeAds, icon: Rocket, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          { label: 'Pending Review', value: summary.totalAds - summary.activeAds, icon: Clock3, color: 'text-orange-600', bg: 'bg-orange-100' },
          { label: 'Total Revenue', value: formatCurrency(summary.verifiedRevenue), icon: TrendingUp, color: 'text-sky-600', bg: 'bg-sky-100' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} className="rounded-3xl border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-600">{item.label}</p>
                  <div className={`rounded-2xl ${item.bg} p-2`}>
                    <Icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                </div>
                <p className="mt-4 text-3xl font-bold tracking-tight text-slate-950">{item.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Section 2 — Revenue */}
      <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Revenue</p>
              <h3 className="mt-1 text-xl font-semibold">Revenue by Package</h3>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {summary.revenueByPackage.length > 0 ? (
              summary.revenueByPackage.map((item: any) => {
                const maxRevenue = Math.max(...summary.revenueByPackage.map((p: any) => p.revenue), 1);
                const widthPercent = Math.max(8, (item.revenue / maxRevenue) * 100);
                return (
                  <div key={item.package} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-900">{item.package}</span>
                      <span className="font-bold text-slate-700">{formatCurrency(item.revenue)}</span>
                    </div>
                    <div className="h-4 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 transition-all duration-500"
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                No verified revenue data yet. Revenue appears here after admin verifies payments.
              </div>
            )}
          </div>
          <div className="mt-6 rounded-[1.5rem] bg-slate-950 p-5 text-white">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Total Verified Revenue</p>
            <p className="mt-2 text-3xl font-bold">{formatCurrency(summary.verifiedRevenue)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Section 3 — Moderation */}
      <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <PieChart className="h-5 w-5 text-sky-500" />
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Moderation</p>
              <h3 className="mt-1 text-xl font-semibold">Approval vs Rejection Rate</h3>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg">
                <p className="text-3xl font-bold text-emerald-700">{Math.round(summary.approvalRate * 100)}%</p>
              </div>
              <p className="mt-4 text-lg font-semibold text-emerald-800">Approved</p>
              <p className="mt-1 text-sm text-emerald-600">Passed moderation review</p>
            </div>
            <div className="rounded-[1.5rem] bg-gradient-to-br from-rose-50 to-rose-100 p-6 text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg">
                <p className="text-3xl font-bold text-rose-700">{Math.round(summary.rejectionRate * 100)}%</p>
              </div>
              <p className="mt-4 text-lg font-semibold text-rose-800">Rejected</p>
              <p className="mt-1 text-sm text-rose-600">Did not pass review</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4 — Taxonomy */}
      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-violet-500" />
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Taxonomy</p>
                <h3 className="mt-1 text-xl font-semibold">Ads by Category</h3>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {summary.adsByCategory.length > 0 ? (
                summary.adsByCategory.map((item: any) => {
                  const maxCount = Math.max(...summary.adsByCategory.map((c: any) => c.count), 1);
                  const widthPercent = Math.max(8, (item.count / maxCount) * 100);
                  return (
                    <div key={item.category} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-700">{item.category}</span>
                        <Badge className="rounded-full bg-violet-100 text-violet-700 hover:bg-violet-100">{item.count}</Badge>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-violet-400 to-violet-600"
                          style={{ width: `${widthPercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-slate-500">No category data available.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-teal-500" />
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Taxonomy</p>
                <h3 className="mt-1 text-xl font-semibold">Ads by City</h3>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {summary.adsByCity.length > 0 ? (
                summary.adsByCity.map((item: any) => {
                  const maxCount = Math.max(...summary.adsByCity.map((c: any) => c.count), 1);
                  const widthPercent = Math.max(8, (item.count / maxCount) * 100);
                  return (
                    <div key={item.city} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-700">{item.city}</span>
                        <Badge className="rounded-full bg-teal-100 text-teal-700 hover:bg-teal-100">{item.count}</Badge>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-teal-400 to-teal-600"
                          style={{ width: `${widthPercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-slate-500">No city data available.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
