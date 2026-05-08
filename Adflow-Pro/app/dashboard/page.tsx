export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Activity, Bell, CreditCard, FileText, Plus, Rocket, Sparkles } from 'lucide-react';
import { ConsoleShell, LogoutAction } from '@/components/console-shell';
import { PortalSidebar } from '@/components/portal-sidebar';
import { StatusPill } from '@/components/status-pill';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getClientDashboardData } from '@/lib/dashboard';
import { formatCurrency, truncate } from '@/lib/utils';

export default async function DashboardPage() {
  const data = await getClientDashboardData();

  return (
    <ConsoleShell
      brandTag="Client Console"
      title="Launch, track, and optimize every sponsored listing from one operating dashboard."
      subtitle="Follow each listing through moderation, payment verification, scheduling, and publishing with live status visibility."
      userLabel={data.user.full_name || data.user.email}
      navItems={[
        { href: '/dashboard/ads/create', label: 'Create Ad' },
        { href: '/explore', label: 'Marketplace' },
        { href: '/packages', label: 'Packages' },
        { href: '/contact', label: 'Support' },
      ]}
      actions={<LogoutAction />}
    >
      <section className="grid gap-6 xl:grid-cols-[300px_1fr]">
        <PortalSidebar
          user={data.user}
          currentPortal="client"
          title="Client Console"
          description="Use one clear sidebar to switch between client, moderator, and admin modules with the correct account."
          navItems={[
            { href: '/dashboard', label: 'Dashboard', hint: 'Overview of listings, spend, and activity.' },
            { href: '/dashboard/ads/create', label: 'Create Ad', hint: 'Start a new campaign draft.' },
            { href: '/explore', label: 'Marketplace', hint: 'Preview the public ad experience.' },
            { href: '/packages', label: 'Packages', hint: 'Compare package tiers and pricing.' },
          ]}
        />

        <div className="space-y-6">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-600">Total Ads</p>
                <div className="rounded-xl bg-slate-100 p-2"><FileText className="h-4 w-4 text-slate-600" /></div>
              </div>
              <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{data.stats.totalAds}</p>
              <p className="mt-1 text-xs text-slate-500">{data.stats.drafts} drafts</p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-600">Published</p>
                <div className="rounded-xl bg-emerald-100 p-2"><Rocket className="h-4 w-4 text-emerald-600" /></div>
              </div>
              <p className="mt-3 text-3xl font-bold tracking-tight text-emerald-700">{data.stats.publishedAds}</p>
              <p className="mt-1 text-xs text-slate-500">Live on marketplace</p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-orange-50 to-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-600">In Progress</p>
                <div className="rounded-xl bg-orange-100 p-2"><Activity className="h-4 w-4 text-orange-600" /></div>
              </div>
              <p className="mt-3 text-3xl font-bold tracking-tight text-orange-700">{data.stats.pendingAds}</p>
              <p className="mt-1 text-xs text-slate-500">Under review or payment</p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-sky-50 to-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-600">Verified Spend</p>
                <div className="rounded-xl bg-sky-100 p-2"><CreditCard className="h-4 w-4 text-sky-600" /></div>
              </div>
              <p className="mt-3 text-3xl font-bold tracking-tight text-sky-700">{formatCurrency(data.stats.totalSpend)}</p>
              <p className="mt-1 text-xs text-slate-500">Confirmed payments</p>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
            <Card className="rounded-[2rem] border-slate-200 bg-white/85 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <CardContent className="p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Your Listings</p>
                    <h2 className="mt-2 text-2xl font-semibold">Campaign pipeline</h2>
                  </div>
                  <Link href="/dashboard/ads/create">
                    <Button className="rounded-full bg-slate-950 hover:bg-slate-800">
                      <Plus className="mr-2 h-4 w-4" />
                      New Ad
                    </Button>
                  </Link>
                </div>
                <div className="space-y-4">
                  {data.ads.length > 0 ? (
                    data.ads.map((ad: any) => (
                      <div key={ad.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="text-xl font-semibold">{ad.title}</h3>
                              <StatusPill status={ad.status} />
                            </div>
                            <p className="text-sm text-slate-600">
                              {ad.category?.name} in {ad.city?.name} - {ad.package?.name ?? 'No package'}
                            </p>
                            <p className="max-w-2xl text-sm leading-7 text-slate-600">{truncate(ad.description, 150)}</p>
                          </div>
                          <div className="flex gap-3">
                            <Link href={`/dashboard/ads/${ad.id}`}>
                              <Button variant="outline" className="rounded-full">View</Button>
                            </Link>
                            <Link href={`/dashboard/ads/${ad.id}/edit`}>
                              <Button className="rounded-full bg-orange-500 text-slate-950 hover:bg-orange-400">Edit</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50/70 p-10 text-center">
                      <Sparkles className="mx-auto h-10 w-10 text-orange-500" />
                      <h3 className="mt-4 text-xl font-semibold">No campaigns yet</h3>
                      <p className="mt-2 text-sm text-slate-600">Create your first listing and push it through the approval workflow.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="rounded-[2rem] border-slate-200 bg-white/85 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                <CardContent className="p-6">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Alerts</p>
                  <h2 className="mt-2 text-2xl font-semibold">Recent notifications</h2>
                  <div className="mt-5 space-y-3">
                    {data.notifications.length > 0 ? (
                      data.notifications.map((notification: any) => (
                        <div key={notification.id} className="rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4">
                          <div className="flex items-start gap-3">
                            <Bell className="mt-1 h-4 w-4 text-orange-500" />
                            <div>
                              <p className="font-medium text-slate-900">{notification.title}</p>
                              <p className="mt-1 text-sm leading-6 text-slate-600">{notification.message}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-600">No unread notifications right now.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[2rem] border-slate-200 bg-white/85 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                <CardContent className="p-6">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Activity Timeline</p>
                  <div className="mt-5 space-y-4">
                    {data.timeline.map((item: any) => (
                      <div key={item.id} className="rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4">
                        <p className="text-sm font-medium text-slate-900">{item.ad?.title ?? 'Ad update'}</p>
                        <p className="mt-1 text-sm text-slate-600">
                          Status moved to <span className="font-medium">{item.to_status}</span>
                        </p>
                        {item.notes ? <p className="mt-2 text-sm text-slate-500">{item.notes}</p> : null}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </section>
    </ConsoleShell>
  );
}
