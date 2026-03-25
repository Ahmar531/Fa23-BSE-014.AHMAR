import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AD_STATUS_COLORS, AD_STATUS_LABELS } from '@/lib/types';
import { FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

export default async function ModeratorDashboardPage() {
  const user = await requireRole(['moderator', 'admin', 'super_admin']);
  const supabase = await createClient();

  // Fetch review queue
  const { data: reviewQueue } = await supabase
    .from('ads')
    .select(`
      *,
      user:users(email, full_name, is_verified_seller),
      package:packages(*),
      category:categories(*),
      city:cities(*),
      media:ad_media(*)
    `)
    .in('status', ['submitted', 'under_review'])
    .order('created_at', { ascending: true });

  // Stats
  const { count: pendingCount } = await supabase
    .from('ads')
    .select('*', { count: 'exact', head: true })
    .in('status', ['submitted', 'under_review']);

  const { count: approvedToday } = await supabase
    .from('ad_status_history')
    .select('*', { count: 'exact', head: true })
    .eq('to_status', 'payment_pending')
    .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString());

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-2xl font-bold text-primary">
              AdFlow Pro
            </Link>
            <Badge variant="secondary">Moderator</Badge>
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
          <h1 className="text-3xl font-bold">Moderator Dashboard</h1>
          <p className="text-muted-foreground">Review and approve submitted ads</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="w-4 h-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCount || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedToday || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">In Queue</CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reviewQueue?.length || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Review Queue */}
        <Card>
          <CardHeader>
            <CardTitle>Review Queue</CardTitle>
            <CardDescription>Review submitted ads for quality and compliance</CardDescription>
          </CardHeader>
          <CardContent>
            {reviewQueue && reviewQueue.length > 0 ? (
              <div className="space-y-6">
                {reviewQueue.map((ad: any) => (
                  <div key={ad.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{ad.title}</h3>
                          <Badge className={AD_STATUS_COLORS[ad.status as keyof typeof AD_STATUS_COLORS]}>
                            {AD_STATUS_LABELS[ad.status as keyof typeof AD_STATUS_LABELS]}
                          </Badge>
                          {ad.user?.is_verified_seller && <Badge>Verified Seller</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          By: {ad.user?.full_name || ad.user?.email}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{ad.category?.name}</span>
                          <span>•</span>
                          <span>{ad.city?.name}</span>
                          <span>•</span>
                          <span>{ad.package?.name} Package</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm whitespace-pre-wrap line-clamp-3">{ad.description}</p>
                    </div>

                    {/* Media Preview */}
                    {ad.media && ad.media.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        {ad.media.slice(0, 4).map((m: any) => (
                          <img
                            key={m.id}
                            src={m.normalized_thumbnail_url || m.original_url}
                            alt="Ad media"
                            className="w-full h-24 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}

                    {/* Contact Info */}
                    <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                      {ad.contact_email && (
                        <div>
                          <span className="text-muted-foreground">Email:</span>{' '}
                          <span className="font-medium">{ad.contact_email}</span>
                        </div>
                      )}
                      {ad.contact_phone && (
                        <div>
                          <span className="text-muted-foreground">Phone:</span>{' '}
                          <span className="font-medium">{ad.contact_phone}</span>
                        </div>
                      )}
                      {ad.website_url && (
                        <div>
                          <span className="text-muted-foreground">Website:</span>{' '}
                          <a href={ad.website_url} target="_blank" className="text-primary hover:underline">
                            Link
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-4 border-t">
                      <form action={`/api/moderator/review`} method="POST" className="flex-1">
                        <input type="hidden" name="ad_id" value={ad.id} />
                        <input type="hidden" name="action" value="approve" />
                        <Button type="submit" className="w-full" size="sm">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                      </form>
                      <form action={`/api/moderator/review`} method="POST" className="flex-1">
                        <input type="hidden" name="ad_id" value={ad.id} />
                        <input type="hidden" name="action" value="reject" />
                        <Button type="submit" variant="destructive" className="w-full" size="sm">
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </form>
                      <Link href={`/ads/${ad.slug}`} target="_blank">
                        <Button variant="outline" size="sm">
                          Preview
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <p className="text-muted-foreground">No ads pending review</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
