import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, CheckCircle, Clock, TrendingUp, Users, FileText } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default async function AdminDashboardPage() {
  const user = await requireRole(['admin', 'super_admin']);
  const supabase = await createClient();

  // Fetch payment verification queue
  const { data: pendingPayments } = await supabase
    .from('payments')
    .select(`
      *,
      ad:ads(id, title, slug),
      user:users(email, full_name)
    `)
    .in('status', ['submitted'])
    .order('submitted_at', { ascending: true });

  // Fetch ads ready to schedule
  const { data: verifiedAds } = await supabase
    .from('ads')
    .select(`
      *,
      package:packages(*),
      category:categories(*),
      payment:payments(*)
    `)
    .eq('status', 'payment_verified')
    .order('updated_at', { ascending: false });

  // Analytics
  const { data: stats } = await supabase.rpc('get_admin_stats').single();
  
  // Fallback stats if RPC doesn't exist
  const { count: totalAds } = await supabase.from('ads').select('*', { count: 'exact', head: true });
  const { count: activeAds } = await supabase.from('ads').select('*', { count: 'exact', head: true }).eq('status', 'published');
  const { data: revenueData } = await supabase.from('payments').select('amount').eq('status', 'verified');
  const totalRevenue = revenueData?.reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0) || 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-2xl font-bold text-primary">
              AdFlow Pro
            </Link>
            <Badge variant="secondary">Admin</Badge>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                My Dashboard
              </Button>
            </Link>
            <span className="text-sm text-muted-foreground">{user.full_name || user.email}</span>
            <form action="/api/auth/logout" method="POST">
              <Button variant="ghost" size="sm" type="submit">
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage payments, scheduling, and analytics</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Ads</CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAds || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Ads</CardTitle>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeAds || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <Clock className="w-4 h-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingPayments?.length || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="payments" className="space-y-6">
          <TabsList>
            <TabsTrigger value="payments">Payment Verification</TabsTrigger>
            <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Payment Verification Tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment Verification Queue</CardTitle>
                <CardDescription>Review and verify submitted payments</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingPayments && pendingPayments.length > 0 ? (
                  <div className="space-y-4">
                    {pendingPayments.map((payment: any) => (
                      <div key={payment.id} className="flex items-start justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{payment.ad?.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            User: {payment.user?.full_name || payment.user?.email}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <span>Amount: {formatCurrency(parseFloat(payment.amount))}</span>
                            <span>Ref: {payment.transaction_ref}</span>
                          </div>
                          {payment.payment_proof_url && (
                            <a
                              href={payment.payment_proof_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline mt-2 inline-block"
                            >
                              View Payment Proof
                            </a>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <form action={`/api/admin/verify-payment`} method="POST">
                            <input type="hidden" name="payment_id" value={payment.id} />
                            <input type="hidden" name="action" value="verify" />
                            <Button size="sm" type="submit">
                              Verify
                            </Button>
                          </form>
                          <form action={`/api/admin/verify-payment`} method="POST">
                            <input type="hidden" name="payment_id" value={payment.id} />
                            <input type="hidden" name="action" value="reject" />
                            <Button size="sm" variant="destructive" type="submit">
                              Reject
                            </Button>
                          </form>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <p className="text-muted-foreground">No pending payments</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scheduling Tab */}
          <TabsContent value="scheduling">
            <Card>
              <CardHeader>
                <CardTitle>Ads Ready to Schedule</CardTitle>
                <CardDescription>Schedule verified ads for publishing</CardDescription>
              </CardHeader>
              <CardContent>
                {verifiedAds && verifiedAds.length > 0 ? (
                  <div className="space-y-4">
                    {verifiedAds.map((ad: any) => (
                      <div key={ad.id} className="flex items-start justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{ad.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Package: {ad.package?.name} ({ad.package?.duration_days} days)
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Category: {ad.category?.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/schedule/${ad.id}`}>
                            <Button size="sm">Schedule</Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No ads ready to schedule</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Revenue</span>
                      <span className="font-semibold">{formatCurrency(totalRevenue)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Average per Ad</span>
                      <span className="font-semibold">
                        {formatCurrency(totalAds ? totalRevenue / totalAds : 0)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ad Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Ads</span>
                      <span className="font-semibold">{totalAds || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Active Ads</span>
                      <span className="font-semibold">{activeAds || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Conversion Rate</span>
                      <span className="font-semibold">
                        {totalAds ? ((activeAds || 0) / totalAds * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
