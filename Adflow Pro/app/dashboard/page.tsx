import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AD_STATUS_COLORS, AD_STATUS_LABELS } from '@/lib/types';
import { Plus, BarChart3, FileText, CheckCircle, Clock } from 'lucide-react';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const supabase = await createClient();

  // Fetch user's ads
  const { data: ads } = await supabase
    .from('ads')
    .select(`
      *,
      package:packages(*),
      category:categories(*),
      city:cities(*),
      payment:payments(*)
    `)
    .eq('user_id', user.id)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false });

  // Fetch notifications
  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_read', false)
    .order('created_at', { ascending: false })
    .limit(5);

  // Stats
  const totalAds = ads?.length || 0;
  const publishedAds = ads?.filter((ad) => ad.status === 'published').length || 0;
  const draftAds = ads?.filter((ad) => ad.status === 'draft').length || 0;
  const pendingAds = ads?.filter((ad) => ['submitted', 'under_review', 'payment_pending', 'payment_submitted'].includes(ad.status)).length || 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            AdFlow Pro
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user.full_name || user.email}
            </span>
            <form action="/api/auth/logout" method="POST">
              <Button variant="ghost" size="sm" type="submit">
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Manage your sponsored listings</p>
          </div>
          <Link href="/dashboard/ads/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Ad
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Ads</CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAds}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{publishedAds}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="w-4 h-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingAds}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{draftAds}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Ads List */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Ads</CardTitle>
                <CardDescription>Manage and track your sponsored listings</CardDescription>
              </CardHeader>
              <CardContent>
                {ads && ads.length > 0 ? (
                  <div className="space-y-4">
                    {ads.map((ad) => (
                      <div key={ad.id} className="flex items-start justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{ad.title}</h3>
                            <Badge className={AD_STATUS_COLORS[ad.status as keyof typeof AD_STATUS_COLORS]}>
                              {AD_STATUS_LABELS[ad.status as keyof typeof AD_STATUS_LABELS]}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {ad.category?.name} • {ad.city?.name}
                          </p>
                          {ad.package && (
                            <p className="text-xs text-muted-foreground">
                              Package: {ad.package.name}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Link href={`/dashboard/ads/${ad.id}`}>
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No ads yet</p>
                    <Link href="/dashboard/ads/create">
                      <Button>Create Your First Ad</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Notifications */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                {notifications && notifications.length > 0 ? (
                  <div className="space-y-3">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="p-3 bg-slate-50 rounded-lg">
                        <p className="font-medium text-sm">{notif.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No new notifications</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
