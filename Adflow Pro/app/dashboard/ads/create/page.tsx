'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus, X } from 'lucide-react';

export default function CreateAdPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [mediaUrls, setMediaUrls] = useState<string[]>(['']);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    city_id: '',
    package_id: '',
    contact_email: '',
    contact_phone: '',
    website_url: '',
    price: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [categoriesRes, citiesRes, packagesRes] = await Promise.all([
      supabase.from('categories').select('*').eq('is_active', true).order('name'),
      supabase.from('cities').select('*').eq('is_active', true).order('name'),
      supabase.from('packages').select('*').eq('is_active', true).order('price'),
    ]);

    if (categoriesRes.data) setCategories(categoriesRes.data);
    if (citiesRes.data) setCities(citiesRes.data);
    if (packagesRes.data) setPackages(packagesRes.data);
  };

  const addMediaUrl = () => {
    if (mediaUrls.length < 10) {
      setMediaUrls([...mediaUrls, '']);
    }
  };

  const removeMediaUrl = (index: number) => {
    setMediaUrls(mediaUrls.filter((_, i) => i !== index));
  };

  const updateMediaUrl = (index: number, value: string) => {
    const updated = [...mediaUrls];
    updated[index] = value;
    setMediaUrls(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create slug from title
      const slug =
        formData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '') +
        '-' +
        Date.now();

      // Create ad
      const { data: ad, error: adError } = await supabase
        .from('ads')
        .insert({
          title: formData.title,
          description: formData.description,
          slug,
          user_id: user.id,
          category_id: formData.category_id,
          city_id: formData.city_id,
          package_id: formData.package_id,
          contact_email: formData.contact_email,
          contact_phone: formData.contact_phone || null,
          website_url: formData.website_url || null,
          price: formData.price ? parseFloat(formData.price) : null,
          status: 'draft',
        })
        .select()
        .single();

      if (adError) throw adError;

      // Add media
      const validMediaUrls = mediaUrls.filter((url) => url.trim());
      if (validMediaUrls.length > 0) {
        const mediaRecords = validMediaUrls.map((url, index) => ({
          ad_id: ad.id,
          original_url: url,
          source_type: 'direct_image',
          is_primary: index === 0,
          sort_order: index,
        }));

        const { error: mediaError } = await supabase.from('ad_media').insert(mediaRecords);
        if (mediaError) throw mediaError;
      }

      // Create payment record
      const selectedPackage = packages.find((p) => p.id === formData.package_id);
      if (selectedPackage) {
        await supabase.from('payments').insert({
          ad_id: ad.id,
          user_id: user.id,
          package_id: selectedPackage.id,
          amount: selectedPackage.price,
          currency: 'PKR',
          status: 'pending',
        });
      }

      toast.success('Ad created successfully!');
      router.push(`/dashboard/ads/${ad.id}`);
    } catch (error: any) {
      console.error('Create ad error:', error);
      toast.error(error.message || 'Failed to create ad');
    } finally {
      setLoading(false);
    }
  };

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

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Create New Ad</CardTitle>
            <CardDescription>Fill in the details to create your sponsored listing</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Ad Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter a compelling title (min 10 characters)"
                  required
                  minLength={10}
                  maxLength={150}
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your offering in detail (min 50 characters)"
                  required
                  minLength={50}
                  maxLength={5000}
                  rows={6}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category_id">Category *</Label>
                  <select
                    id="category_id"
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="city_id">City *</Label>
                  <select
                    id="city_id"
                    value={formData.city_id}
                    onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Select city</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="package_id">Package *</Label>
                <select
                  id="package_id"
                  value={formData.package_id}
                  onChange={(e) => setFormData({ ...formData, package_id: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="">Select package</option>
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} - Rs {parseFloat(pkg.price).toLocaleString('en-PK')} ({pkg.duration_days} days)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact_email">Contact Email *</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    type="tel"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website_url">Website URL</Label>
                  <Input
                    id="website_url"
                    type="url"
                    value={formData.website_url}
                    onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="price">Price (optional)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <Label>Media URLs (Images/YouTube) *</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Add direct image URLs, GitHub raw URLs, or YouTube links
                </p>
                <div className="space-y-2">
                  {mediaUrls.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={url}
                        onChange={(e) => updateMediaUrl(index, e.target.value)}
                        placeholder="https://example.com/image.jpg or YouTube URL"
                        required={index === 0}
                      />
                      {mediaUrls.length > 1 && (
                        <Button type="button" variant="outline" size="icon" onClick={() => removeMediaUrl(index)}>
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                {mediaUrls.length < 10 && (
                  <Button type="button" variant="outline" size="sm" onClick={addMediaUrl} className="mt-2">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Media URL
                  </Button>
                )}
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Creating...' : 'Create Ad'}
                </Button>
                <Link href="/dashboard">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
