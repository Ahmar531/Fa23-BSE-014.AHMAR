import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/server';
import { Search } from 'lucide-react';

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; city?: string; page?: string };
}) {
  const supabase = await createClient();
  const page = parseInt(searchParams.page || '1');
  const pageSize = 12;
  const offset = (page - 1) * pageSize;

  // Build query
  let query = supabase
    .from('v_public_ads')
    .select('*', { count: 'exact' })
    .order('rank_score', { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (searchParams.q) {
    query = query.or(`title.ilike.%${searchParams.q}%,description.ilike.%${searchParams.q}%`);
  }

  if (searchParams.category) {
    query = query.eq('category_slug', searchParams.category);
  }

  if (searchParams.city) {
    query = query.eq('city_slug', searchParams.city);
  }

  const { data: ads, count } = await query;

  // Fetch categories and cities for filters
  const { data: categories } = await supabase.from('categories').select('*').eq('is_active', true).order('name');

  const { data: cities } = await supabase.from('cities').select('*').eq('is_active', true).order('name');

  const totalPages = count ? Math.ceil(count / pageSize) : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            AdFlow Pro
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/explore" className="text-sm hover:text-primary">
              Explore Ads
            </Link>
            <Link href="/packages" className="text-sm hover:text-primary">
              Packages
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Explore Listings</h1>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <form method="GET" className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    name="q"
                    placeholder="Search ads..."
                    defaultValue={searchParams.q}
                    className="pl-10"
                  />
                </div>
                <Button type="submit">Search</Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <select
                  name="category"
                  defaultValue={searchParams.category}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">All Categories</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <select
                  name="city"
                  defaultValue={searchParams.city}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">All Cities</option>
                  {cities?.map((city) => (
                    <option key={city.id} value={city.slug}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-4 text-sm text-muted-foreground">
          Found {count || 0} listings
        </div>

        {ads && ads.length > 0 ? (
          <>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {ads.map((ad) => (
                <Link key={ad.id} href={`/ads/${ad.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        {ad.is_featured && <Badge variant="secondary">Featured</Badge>}
                        {ad.is_verified_seller && <Badge>Verified</Badge>}
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{ad.title}</CardTitle>
                      <CardDescription className="line-clamp-3">{ad.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{ad.category_name}</span>
                        <span>{ad.city_name}</span>
                      </div>
                      {ad.price && (
                        <div className="mt-2 font-semibold text-primary">
                          Rs {parseFloat(ad.price).toLocaleString('en-PK')}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                {page > 1 && (
                  <Link
                    href={`/explore?${new URLSearchParams({ ...searchParams, page: String(page - 1) }).toString()}`}
                  >
                    <Button variant="outline">Previous</Button>
                  </Link>
                )}
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <Link
                    href={`/explore?${new URLSearchParams({ ...searchParams, page: String(page + 1) }).toString()}`}
                  >
                    <Button variant="outline">Next</Button>
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No ads found matching your criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
