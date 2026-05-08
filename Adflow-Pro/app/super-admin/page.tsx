import { BarChart3, Building2, ClipboardList, DollarSign, MapPinned, Package2, ShieldCheck, Users2 } from 'lucide-react';
export const dynamic = 'force-dynamic';

import { ConsoleShell, LogoutAction } from '@/components/console-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getSuperAdminDashboardData } from '@/lib/dashboard';
import { SuperAdminControlPanel } from '@/components/super-admin-control-panel';
import { createClient } from '@/lib/supabase/server';
import { formatCurrency } from '@/lib/utils';

export default async function SuperAdminPage() {
  const data = await getSuperAdminDashboardData();
  const supabase = await createClient();
  const { data: auditLogs } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  return (
    <ConsoleShell
      brandTag="Super Admin"
      title="Control packages, marketplace taxonomy, and privileged operations from a single governance view."
      subtitle="Use this layer to manage the commercial model and the people operating the marketplace."
      userLabel={data.user.full_name || data.user.email}
      navItems={[
        { href: '/admin', label: 'Admin Console' },
        { href: '/moderator', label: 'Moderator Desk' },
        { href: '/dashboard', label: 'Client Dashboard' },
      ]}
      actions={<LogoutAction />}
    >
      {/* KPI Cards */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-[2rem] border-slate-200 bg-gradient-to-br from-orange-50 to-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-600">Packages</p>
              <div className="rounded-xl bg-orange-100 p-2"><Package2 className="h-4 w-4 text-orange-600" /></div>
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{data.packages.length}</p>
            <p className="mt-1 text-xs text-slate-500">Active package tiers</p>
          </CardContent>
        </Card>
        <Card className="rounded-[2rem] border-slate-200 bg-gradient-to-br from-sky-50 to-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-600">Categories</p>
              <div className="rounded-xl bg-sky-100 p-2"><Building2 className="h-4 w-4 text-sky-600" /></div>
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{data.categories.length}</p>
            <p className="mt-1 text-xs text-slate-500">Marketplace taxonomy</p>
          </CardContent>
        </Card>
        <Card className="rounded-[2rem] border-slate-200 bg-gradient-to-br from-emerald-50 to-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-600">Cities</p>
              <div className="rounded-xl bg-emerald-100 p-2"><MapPinned className="h-4 w-4 text-emerald-600" /></div>
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{data.cities.length}</p>
            <p className="mt-1 text-xs text-slate-500">Active locations</p>
          </CardContent>
        </Card>
        <Card className="rounded-[2rem] border-slate-200 bg-gradient-to-br from-violet-50 to-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-600">Staff</p>
              <div className="rounded-xl bg-violet-100 p-2"><Users2 className="h-4 w-4 text-violet-600" /></div>
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{data.staff.length}</p>
            <p className="mt-1 text-xs text-slate-500">Privileged accounts</p>
          </CardContent>
        </Card>
      </section>

      {/* Revenue & Analytics Summary */}
      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-[2rem] border-slate-200 bg-slate-950 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-orange-400" />
              <p className="text-xs uppercase tracking-[0.28em] text-orange-300">Verified Revenue</p>
            </div>
            <p className="mt-4 text-4xl font-bold">{formatCurrency(data.summary.verifiedRevenue)}</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <p className="text-xs text-slate-400">Total Ads</p>
                <p className="mt-1 text-xl font-semibold">{data.summary.totalAds}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <p className="text-xs text-slate-400">Published</p>
                <p className="mt-1 text-xl font-semibold">{data.summary.activeAds}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-slate-200 bg-white/85 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-sky-500" />
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Revenue by Package</p>
            </div>
            <div className="mt-5 space-y-3">
              {data.summary.revenueByPackage.length > 0 ? data.summary.revenueByPackage.map((item: any) => {
                const maxRevenue = Math.max(...data.summary.revenueByPackage.map((r: any) => r.revenue), 1);
                return (
                  <div key={item.package}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{item.package}</span>
                      <span className="font-semibold text-slate-900">{formatCurrency(item.revenue)}</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-sky-600" style={{ width: `${(item.revenue / maxRevenue) * 100}%` }} />
                    </div>
                  </div>
                );
              }) : (
                <p className="text-sm text-slate-500">No revenue data yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Taxonomy Lists */}
      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-[2rem] border-slate-200 bg-white/85 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Packages</p>
            <div className="mt-5 space-y-3">
              {data.packages.map((pkg: any) => (
                <div key={pkg.id} className="rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-slate-900">{pkg.name}</p>
                    <Badge className="rounded-full bg-orange-100 text-orange-700 hover:bg-orange-100">{formatCurrency(Number(pkg.price))}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{pkg.duration_days} days &bull; Weight {pkg.featured_weight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-slate-200 bg-white/85 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Categories</p>
            <div className="mt-5 space-y-3">
              {data.categories.map((category: any) => (
                <div key={category.id} className="flex items-center justify-between rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4">
                  <div>
                    <p className="font-medium text-slate-900">{category.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{category.slug}</p>
                  </div>
                  {category.is_active ? (
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-slate-300" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-slate-200 bg-white/85 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Marketplace Staff</p>
            <div className="mt-5 space-y-3">
              {data.staff.map((member: any) => (
                <div key={member.id} className="flex items-center justify-between rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4">
                  <div>
                    <p className="font-medium text-slate-900">{member.full_name || member.email}</p>
                    <p className="mt-1 text-xs text-slate-500">{member.email}</p>
                  </div>
                  <Badge className={`rounded-full ${
                    member.role === 'super_admin' ? 'bg-violet-100 text-violet-700 hover:bg-violet-100' :
                    member.role === 'admin' ? 'bg-sky-100 text-sky-700 hover:bg-sky-100' :
                    'bg-slate-100 text-slate-700 hover:bg-slate-100'
                  }`}>{member.role}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Audit Logs */}
      <Card className="rounded-[2rem] border-slate-200 bg-white/85 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-violet-500" />
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Recent Audit Logs</p>
          </div>
          <div className="mt-5 space-y-3">
            {(auditLogs ?? []).length > 0 ? (auditLogs ?? []).map((log: any) => (
              <div key={log.id} className="rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge className="rounded-full bg-slate-950 text-white hover:bg-slate-950 text-[10px]">{log.action}</Badge>
                    <span className="text-sm font-medium text-slate-700">{log.entity_type}</span>
                  </div>
                  <span className="text-xs text-slate-500">{new Date(log.created_at).toLocaleString()}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {log.actor_email || 'System'} &mdash; {log.entity_id ? `ID: ${log.entity_id.slice(0, 8)}...` : 'N/A'}
                </p>
              </div>
            )) : (
              <p className="text-sm text-slate-500">No audit logs recorded yet.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* CRUD Control Panel */}
      <SuperAdminControlPanel
        packages={data.packages as any}
        categories={data.categories as any}
        cities={data.cities as any}
      />
    </ConsoleShell>
  );
}
