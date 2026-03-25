import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/server';
import { Mail, Phone, Globe, MapPin, Tag, Eye } from 'lucide-react';
import { getPlaceholderImage } from '@/lib/media';

export default async function AdDetailPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();

  // Fetch ad with relations
  const { data: ad } = await supabase
    .from('v_public_ads')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!ad) {
    notFound();
  }

  // Fetch media
  const { data: media } = await supabase
    .from('ad_media')
    .select('*')
    .eq('ad_id', ad.id)
    .order('sort_order');

  // Increment view count (fire and forget)
  supabase
    .from('ads')
    .update({ view_count: ad.view_count + 1 })
    .eq('id', ad.id)
    .then();

  const primaryMedia = media?.[0];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            AdFlow Pro
          </Link>
          <Link href="/explore">
            <Button variant="ghost" size="sm">
              Back to Explore
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start gap-3 mb-4">
                  {ad.is_featured && <Badge variant="secondary">Featured</Badge>}
                  {ad.is_verified_seller && <Badge>Verified Seller</Badge>}
                  <Badge variant="outline">{ad.package_name}</Badge>
                </div>
                <CardTitle className="text-3xl">{ad.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                  <span className="flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    {ad.category_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {ad.city_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {ad.view_count} views
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {/* Media */}
                {primaryMedia && (
                  <div className="mb-6">
                    <img
                      src={primaryMedia.normalized_thumbnail_url || primaryMedia.original_url || getPlaceholderImage()}
                      alt={ad.title}
                      className="w-full h-96 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = getPlaceholderImage();
                      }}
                    />
                  </div>
                )}

                {/* Description */}
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{ad.description}</p>
                </div>

                {/* Price */}
                {ad.price && (
                  <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                    <div className="text-sm text-muted-foreground">Price</div>
                    <div className="text-3xl font-bold text-primary">
                      Rs {parseFloat(ad.price).toLocaleString('en-PK')}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Media */}
            {media && media.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>More Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {media.slice(1).map((m: any) => (
                      <img
                        key={m.id}
                        src={m.normalized_thumbnail_url || m.original_url || getPlaceholderImage()}
                        alt="Additional media"
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = getPlaceholderImage();
                        }}
                      />
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
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ad.seller_name && (
                  <div>
                    <div className="text-sm text-muted-foreground">Seller</div>
                    <div className="font-medium">{ad.seller_name}</div>
                  </div>
                )}

                {ad.contact_email && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Email</div>
                    <a
                      href={`mailto:${ad.contact_email}`}
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <Mail className="w-4 h-4" />
                      {ad.contact_email}
                    </a>
                  </div>
                )}

                {ad.contact_phone && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Phone</div>
                    <a
                      href={`tel:${ad.contact_phone}`}
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <Phone className="w-4 h-4" />
                      {ad.contact_phone}
                    </a>
                  </div>
                )}

                {ad.website_url && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Website</div>
                    <a
                      href={ad.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <Globe className="w-4 h-4" />
                      Visit Website
                    </a>
                  </div>
                )}

                <Button className="w-full" asChild>
                  <a href={`mailto:${ad.contact_email}`}>Contact Seller</a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ad Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium">{ad.category_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium">{ad.city_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Package</span>
                  <span className="font-medium">{ad.package_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Views</span>
                  <span className="font-medium">{ad.view_count}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
