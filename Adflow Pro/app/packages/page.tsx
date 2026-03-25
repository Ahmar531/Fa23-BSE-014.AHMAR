import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';
import { Check } from 'lucide-react';

export default async function PackagesPage() {
  const supabase = await createClient();
  const { data: packages } = await supabase
    .from('packages')
    .select('*')
    .eq('is_active', true)
    .order('price', { ascending: true });

  return (
    <div className="min-h-screen bg-slate-50">
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

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Package</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the perfect package for your advertising needs. All packages include moderation and payment verification.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages?.map((pkg) => (
            <Card
              key={pkg.id}
              className={pkg.tier === 'premium' ? 'border-primary shadow-xl scale-105' : ''}
            >
              <CardHeader>
                {pkg.tier === 'premium' && (
                  <div className="text-xs font-semibold text-primary mb-2">MOST POPULAR</div>
                )}
                <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                <CardDescription>{pkg.description}</CardDescription>
                <div className="text-4xl font-bold mt-6">
                  Rs {pkg.price.toLocaleString()}
                  <span className="text-base text-muted-foreground font-normal">
                    /{pkg.duration_days} days
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{pkg.duration_days} days of visibility</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">
                      {pkg.homepage_visibility ? 'Homepage placement' : 'Category page placement'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{pkg.featured_weight}x ranking weight</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">
                      {pkg.refresh_rule === 'auto_3_days'
                        ? 'Auto-refresh every 3 days'
                        : pkg.refresh_rule === 'manual'
                        ? 'Manual refresh available'
                        : 'Standard refresh'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Strict moderation & verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Analytics dashboard</span>
                  </li>
                </ul>
                <Link href="/auth/register">
                  <Button
                    className="w-full"
                    variant={pkg.tier === 'premium' ? 'default' : 'outline'}
                  >
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Why Choose AdFlow Pro?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-8">
            <div>
              <h3 className="font-semibold mb-2">Strict Moderation</h3>
              <p className="text-sm text-muted-foreground">
                Every ad is reviewed by our moderation team to ensure quality and compliance
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Payment Verification</h3>
              <p className="text-sm text-muted-foreground">
                All payments are verified before ads go live, ensuring trust and transparency
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Smart Ranking</h3>
              <p className="text-sm text-muted-foreground">
                Our algorithm ensures maximum visibility based on package, freshness, and engagement
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
