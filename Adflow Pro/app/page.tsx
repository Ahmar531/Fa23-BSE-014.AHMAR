import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/server';
import { Sparkles, TrendingUp, Shield, Clock } from 'lucide-react';
import { SetupRequired } from '@/components/setup-required';

export default async function HomePage() {
  // Check if Supabase is configured
  const isSupabaseConfigured = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';

  if (!isSupabaseConfigured) {
    return <SetupRequired />;
  }

  const supabase = await createClient();

  // Fetch data with proper error handling
  let featuredAds = null;
  let recentAds = null;
  let packages = null;
  let questions = null;

  try {
    const featuredRes = await supabase
      .from('v_public_ads')
      .select('*')
      .eq('is_featured', true)
      .order('rank_score', { ascending: false })
      .limit(6);
    featuredAds = featuredRes.data;
  } catch (error) {
    console.error('Error fetching featured ads:', error);
  }

  try {
    const recentRes = await supabase
      .from('v_public_ads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(8);
    recentAds = recentRes.data;
  } catch (error) {
    console.error('Error fetching recent ads:', error);
  }

  try {
    const packagesRes = await supabase
      .from('packages')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true});
    packages = packagesRes.data;
  } catch (error) {
    console.error('Error fetching packages:', error);
  }

  try {
    const questionsRes = await supabase
      .from('learning_questions')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single();
    questions = questionsRes.data;
  } catch (error) {
    console.error('Error fetching questions:', error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
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
            <Link href="/faq" className="text-sm hover:text-primary">
              FAQ
            </Link>
            <Link href="/contact" className="text-sm hover:text-primary">
              Contact
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

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge className="mb-4" variant="secondary">
          <Sparkles className="w-3 h-3 mr-1" />
          Trusted by 10,000+ Businesses
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Amplify Your Reach with
          <br />
          Sponsored Listings
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Professional marketplace with strict moderation, payment verification, and powerful analytics.
          Get your business in front of thousands of potential customers.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/auth/register">
            <Button size="lg">Start Advertising</Button>
          </Link>
          <Link href="/explore">
            <Button size="lg" variant="outline">
              Browse Listings
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <Card>
            <CardHeader>
              <Shield className="w-10 h-10 text-primary mb-2" />
              <CardTitle className="text-lg">Verified & Moderated</CardTitle>
              <CardDescription>Every ad goes through strict review and payment verification</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <TrendingUp className="w-10 h-10 text-primary mb-2" />
              <CardTitle className="text-lg">Smart Ranking</CardTitle>
              <CardDescription>Advanced algorithm ensures maximum visibility for your ads</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Clock className="w-10 h-10 text-primary mb-2" />
              <CardTitle className="text-lg">Flexible Scheduling</CardTitle>
              <CardDescription>Schedule ads in advance with automatic expiry management</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Featured Ads */}
      {featuredAds && featuredAds.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Listings</h2>
            <Link href="/explore?featured=true">
              <Button variant="ghost">View All</Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredAds.map((ad) => (
              <Link key={ad.id} href={`/ads/${ad.slug}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Badge variant="secondary">Featured</Badge>
                      {ad.is_verified_seller && <Badge>Verified</Badge>}
                    </div>
                    <CardTitle className="text-lg mt-2">{ad.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{ad.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{ad.category_name}</span>
                      <span>{ad.city_name}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Packages */}
      {packages && packages.length > 0 && (
        <section className="container mx-auto px-4 py-16 bg-slate-50">
          <h2 className="text-3xl font-bold text-center mb-12">Choose Your Package</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {packages.map((pkg) => (
              <Card key={pkg.id} className={pkg.tier === 'premium' ? 'border-primary shadow-lg' : ''}>
                <CardHeader>
                  <CardTitle>{pkg.name}</CardTitle>
                  <CardDescription>{pkg.description}</CardDescription>
                  <div className="text-3xl font-bold mt-4">
                    Rs {pkg.price.toLocaleString()}
                    <span className="text-sm text-muted-foreground font-normal">/{pkg.duration_days} days</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>✓ {pkg.duration_days} days visibility</li>
                    <li>✓ {pkg.homepage_visibility ? 'Homepage placement' : 'Category placement'}</li>
                    <li>✓ {pkg.featured_weight}x ranking weight</li>
                    <li>✓ {pkg.refresh_rule === 'auto_3_days' ? 'Auto-refresh every 3 days' : 'Manual refresh'}</li>
                  </ul>
                  <Link href="/auth/register">
                    <Button className="w-full mt-6">Get Started</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Recent Ads */}
      {recentAds && recentAds.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Recent Listings</h2>
            <Link href="/explore">
              <Button variant="ghost">View All</Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {recentAds.map((ad) => (
              <Link key={ad.id} href={`/ads/${ad.slug}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="text-base line-clamp-2">{ad.title}</CardTitle>
                    <CardDescription className="text-xs">{ad.category_name}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Learning Question Widget */}
      {questions && (
        <section className="container mx-auto px-4 py-16 bg-primary/5">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Quick Quiz</CardTitle>
              <CardDescription>{questions.question}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(questions.options as Array<{ text: string; is_correct: boolean }>).map((option, idx) => (
                  <Button key={idx} variant="outline" className="w-full justify-start">
                    {option.text}
                  </Button>
                ))}
              </div>
              {questions.explanation && (
                <p className="text-sm text-muted-foreground mt-4">{questions.explanation}</p>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t bg-slate-50 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">AdFlow Pro</h3>
              <p className="text-sm text-muted-foreground">
                Professional sponsored listing marketplace with moderation and analytics.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/explore" className="hover:text-primary">
                    Explore Ads
                  </Link>
                </li>
                <li>
                  <Link href="/packages" className="hover:text-primary">
                    Packages
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/faq" className="hover:text-primary">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/terms" className="hover:text-primary">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2026 AdFlow Pro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
