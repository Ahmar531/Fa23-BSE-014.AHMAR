import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AD_STATUS_COLORS, AD_STATUS_LABELS } from '@/lib/types';
import { ArrowLeft, Eye, MousePointerClick } from 'lucide-react';

export default async function AdDetailDashboardPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const supabase = await createClient();

  // Fetch ad with relations
  const { data: ad } = await supabase
    .from('ads')
    .select(`
      *,
      package:packages(*),
      category:categories(*),
      city:cities(*),
      media:ad_media(*),
      payment:payments(*)
    `)
    .eq('id', params.id)
    .single();

  if (!ad) notFound();

  // Check ownership (unless staff)
  if (ad.user_id !== user.id && !['moderator', 'admin', 'super_admin'].includes(user.role)) {
    redirect('/dashboard');
  }

  // Fetch status history
  const { data: statusHistory } = await supabase
    .from('ad_status_history')
    .select('*')
    .eq('ad_id', ad.id)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{ad.title}</h1>
            <Badge className={AD_STATUS_COLORS[ad.status as keyof typeof AD_STATUS_COLORS]}>
              {AD_STATUS_LABELS[ad.status as keyof typeof AD_STATUS_LABELS]}
            </Badge>
          </div>
          {ad.status === 'draft' && (
            <Link href={`/dashboard/ads/${ad.id}/edit`}>
              <Button>Edit Ad</Button>
            </Link>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ad Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Description</div>
                  <p className="whitespace-pre-wrap">{ad.description}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Category</div>
                    <div className="font-medium">{ad.category?.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">City</div>
                    <div className="font-medium">{ad.city?.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Package</div>
                    <div className="font-medium">{ad.package?.name}</div>
                  </div>
                  {ad.price && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Price</div>
                      <div className="font-medium">Rs {parseFloat(ad.price).toLocaleString('en-PK')}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Media */}
            {ad.media && ad.media.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Media</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {ad.media.map((m: any) => (
                      <div key={m.id} className="border rounded-lg p-2">
                        <img
                          src={m.normalized_thumbnail_url || m.original_url}
                          alt="Ad media"
                          className="w-full h-32 object-cover rounded"
                        />
                        <p className="text-xs text-muted-foreground mt-2 truncate">{m.source_type}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Status History */}
            {statusHistory && statusHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Status History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {statusHistory.map((history: any) => (
                      <div key={history.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {history.from_status && (
                              <Badge variant="outline" className="text-xs">
                                {AD_STATUS_LABELS[history.from_status as keyof typeof AD_STATUS_LABELS]}
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">→</span>
                            <Badge className={AD_STATUS_COLORS[history.to_status as keyof typeof AD_STATUS_COLORS]}>
                              {AD_STATUS_LABELS[history.to_status as keyof typeof AD_STATUS_LABELS]}
                            </Badge>
                          </div>
                          {history.notes && (
                            <p className="text-sm text-muted-foreground mt-1">{history.notes}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(history.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    Views
                  </div>
                  <div className="font-semibold">{ad.view_count}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MousePointerClick className="w-4 h-4" />
                    Clicks
                  </div>
                  <div className="font-semibold">{ad.click_count}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Rank Score</div>
                  <div className="font-semibold">{ad.rank_score}</div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Info */}
            {ad.payment && ad.payment.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-medium">${parseFloat(ad.payment[0].amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant={ad.payment[0].status === 'verified' ? 'default' : 'secondary'}>
                        {ad.payment[0].status}
                      </Badge>
                    </div>
                    {ad.payment[0].transaction_ref && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ref</span>
                        <span className="font-mono text-xs">{ad.payment[0].transaction_ref}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {ad.status === 'published' && (
                  <Link href={`/ads/${ad.slug}`} target="_blank">
                    <Button variant="outline" className="w-full">
                      View Public Page
                    </Button>
                  </Link>
                )}
                {ad.status === 'payment_pending' && (
                  <Link href={`/dashboard/ads/${ad.id}/payment`}>
                    <Button className="w-full">Submit Payment</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
