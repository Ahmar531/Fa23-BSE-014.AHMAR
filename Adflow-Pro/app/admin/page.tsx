export const dynamic = 'force-dynamic';

import Link from 'next/link';
import {
  Activity,
  BadgeDollarSign,
  Clock3,
  CreditCard,
  FileText,
  Layers3,
  Rocket,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAdminDashboardData } from '@/lib/dashboard';
import { formatCurrency } from '@/lib/utils';

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData();

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-3xl border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">Total Ads</p>
              <div className="rounded-2xl bg-slate-100 p-2">
                <Layers3 className="h-5 w-5 text-slate-600" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold tracking-tight text-slate-950">{data.summary.totalAds}</p>
            <p className="mt-1 text-xs text-slate-500">All listings in system</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-emerald-100 bg-gradient-to-br from-emerald-50 to-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-emerald-700">Active Published</p>
              <div className="rounded-2xl bg-emerald-100 p-2">
                <Rocket className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold tracking-tight text-emerald-700">{data.summary.activeAds}</p>
            <p className="mt-1 text-xs text-emerald-600">Live in marketplace</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-orange-100 bg-gradient-to-br from-orange-50 to-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-orange-700">Pending Payments</p>
              <div className="rounded-2xl bg-orange-100 p-2">
                <CreditCard className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold tracking-tight text-orange-700">{data.pendingPayments.length}</p>
            <p className="mt-1 text-xs text-orange-600">Awaiting verification</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-sky-100 bg-gradient-to-br from-sky-50 to-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-sky-700">Revenue</p>
              <div className="rounded-2xl bg-sky-100 p-2">
                <BadgeDollarSign className="h-5 w-5 text-sky-600" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold tracking-tight text-sky-700">{formatCurrency(data.summary.verifiedRevenue)}</p>
            <p className="mt-1 text-xs text-sky-600">Verified payments total</p>
          </CardContent>
        </Card>
      </section>

      {/* Revenue by Package + Moderation Stats */}
      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Revenue by Package</p>
            <h3 className="mt-2 text-xl font-semibold">Package Performance</h3>
            <div className="mt-5 space-y-3">
              {data.summary.revenueByPackage.length > 0 ? (
                data.summary.revenueByPackage.map((item: any) => {
                  const maxRevenue = Math.max(...data.summary.revenueByPackage.map((p: any) => p.revenue), 1);
                  const widthPercent = Math.max(8, (item.revenue / maxRevenue) * 100);
                  return (
                    <div key={item.package} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-900">{item.package}</span>
                        <span className="font-semibold text-slate-700">{formatCurrency(item.revenue)}</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all"
                          style={{ width: `${widthPercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-slate-500">No verified revenue data yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Moderation</p>
            <h3 className="mt-2 text-xl font-semibold">Approval vs Rejection</h3>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-[1.5rem] bg-emerald-50 p-5 text-center">
                <p className="text-4xl font-bold text-emerald-700">
                  {Math.round(data.summary.approvalRate * 100)}%
                </p>
                <p className="mt-2 text-sm text-emerald-600">Approval Rate</p>
              </div>
              <div className="rounded-[1.5rem] bg-rose-50 p-5 text-center">
                <p className="text-4xl font-bold text-rose-700">
                  {Math.round(data.summary.rejectionRate * 100)}%
                </p>
                <p className="mt-2 text-sm text-rose-600">Rejection Rate</p>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Ads by Category</p>
              {data.summary.adsByCategory.slice(0, 5).map((item: any) => (
                <div key={item.category} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
                  <span className="text-slate-700">{item.category}</span>
                  <Badge className="rounded-full bg-slate-200 text-slate-700 hover:bg-slate-200">{item.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Payment Verification Queue */}
      <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Payment Queue</p>
              <h3 className="mt-2 text-xl font-semibold">Pending Verifications</h3>
            </div>
            <Badge className="rounded-full bg-orange-100 text-orange-700 hover:bg-orange-100">
              {data.pendingPayments.length} pending
            </Badge>
          </div>

          <div className="mt-5 space-y-4">
            {data.pendingPayments.length > 0 ? (
              data.pendingPayments.map((payment: any) => (
                <div key={payment.id} className="rounded-2xl border border-slate-200 p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className="text-lg font-semibold text-slate-900">{payment.ad?.title || 'Untitled Ad'}</h4>
                        <Badge className="rounded-full bg-orange-100 text-orange-700 hover:bg-orange-100">
                          {payment.package?.name || 'Unknown'}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">
                        By {payment.user?.full_name || payment.user?.email || 'Unknown User'}
                      </p>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-xl bg-slate-50 px-3 py-2">
                          <p className="text-xs text-slate-500">Amount</p>
                          <p className="font-semibold text-slate-900">{formatCurrency(Number(payment.amount ?? 0))}</p>
                        </div>
                        <div className="rounded-xl bg-slate-50 px-3 py-2">
                          <p className="text-xs text-slate-500">Ref</p>
                          <p className="font-mono text-xs text-slate-900">{payment.transaction_ref || 'N/A'}</p>
                        </div>
                        <div className="rounded-xl bg-slate-50 px-3 py-2">
                          <p className="text-xs text-slate-500">Notes</p>
                          <p className="text-xs text-slate-700">{payment.notes || 'None'}</p>
                        </div>
                      </div>
                      {payment.payment_proof_url ? (
                        <a href={payment.payment_proof_url} target="_blank" rel="noreferrer" className="inline-flex text-sm font-medium text-orange-600 hover:text-orange-500">
                          View Payment Proof →
                        </a>
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-2">
                      <form action={`/api/admin/payments/${payment.id}/verify`} method="POST" className="inline">
                        <input type="hidden" name="action" value="verify" />
                        <Button type="submit" className="w-full rounded-full bg-emerald-600 hover:bg-emerald-700">
                          ✓ Verify Payment
                        </Button>
                      </form>
                      <details className="group">
                        <summary className="list-none cursor-pointer">
                          <Button type="button" variant="destructive" className="w-full rounded-full" asChild>
                            <span>✕ Reject Payment</span>
                          </Button>
                        </summary>
                        <form action={`/api/admin/payments/${payment.id}/verify`} method="POST" className="mt-3 space-y-2">
                          <input type="hidden" name="action" value="reject" />
                          <textarea
                            name="rejection_reason"
                            required
                            rows={2}
                            placeholder="Reason for rejection (required)…"
                            className="w-full rounded-xl border border-rose-200 bg-rose-50 p-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-300"
                          />
                          <Button type="submit" variant="destructive" className="w-full rounded-full">
                            Confirm Reject
                          </Button>
                        </form>
                      </details>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                <CreditCard className="mx-auto h-10 w-10 text-slate-400" />
                <p className="mt-3 text-sm text-slate-600">No payments waiting for verification</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Verified Ads Ready to Publish */}
      {data.verifiedAds.length > 0 ? (
        <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Ready to Publish</p>
            <h3 className="mt-2 text-xl font-semibold">Payment Verified Ads</h3>
            <div className="mt-5 space-y-3">
              {data.verifiedAds.map((ad: any) => (
                <div key={ad.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{ad.title}</p>
                    <p className="text-sm text-slate-600">
                      {ad.category?.name} • {ad.city?.name} • {ad.package?.name}
                    </p>
                  </div>
                  <Link href={`/admin/ads/${ad.id}/schedule`}>
                    <Button className="rounded-full bg-slate-950 hover:bg-slate-800">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Schedule / Publish
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* System Health */}
      <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <CardContent className="p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">System</p>
          <h3 className="mt-2 text-xl font-semibold">Recent Health Checks</h3>
          <div className="mt-5 space-y-2">
            {data.healthLogs.length > 0 ? (
              data.healthLogs.map((log: any) => (
                <div key={log.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-2.5 w-2.5 rounded-full ${log.status === 'ok' ? 'bg-emerald-500' : log.status === 'warning' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                    <span className="text-sm text-slate-700">{log.check_type}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    {log.duration_ms != null ? <span>{log.duration_ms}ms</span> : null}
                    <span>{new Date(log.created_at).toLocaleString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No health check data available yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
