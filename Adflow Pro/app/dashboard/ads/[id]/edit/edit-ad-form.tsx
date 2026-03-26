'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, ArrowLeft } from 'lucide-react';

type Category = { id: string; name: string };
type City = { id: string; name: string };
type Package = { id: string; name: string; price: number; duration_days: number };

type EditAdFormProps = {
  adId: string;
  initialAd: any;
  initialMediaUrls: string[];
  categories: Category[];
  cities: City[];
  packages: Package[];
};

export default function EditAdForm({
  adId,
  initialAd,
  initialMediaUrls,
  categories,
  cities,
  packages,
}: EditAdFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const initialMedia = useMemo(() => {
    const urls = (initialMediaUrls || []).filter((u) => typeof u === 'string' && u.trim().length > 0);
    return urls.length > 0 ? urls.slice(0, 10) : [''];
  }, [initialMediaUrls]);

  const [loading, setLoading] = useState(false);
  const [mediaUrls, setMediaUrls] = useState<string[]>(initialMedia);
  const [formData, setFormData] = useState({
    title: initialAd.title || '',
    description: initialAd.description || '',
    category_id: initialAd.category_id || '',
    city_id: initialAd.city_id || '',
    package_id: initialAd.package_id || '',
    contact_email: initialAd.contact_email || '',
    contact_phone: initialAd.contact_phone || '',
    website_url: initialAd.website_url || '',
    price: initialAd.price != null ? String(initialAd.price) : '',
  });

  const addMediaUrl = () => {
    if (mediaUrls.length < 10) setMediaUrls((prev) => [...prev, '']);
  };

  const removeMediaUrl = (index: number) => {
    setMediaUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const updateMediaUrl = (index: number, value: string) => {
    setMediaUrls((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('Not authenticated');

      const slug =
        formData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '') + '-' + Date.now();

      // 1) Update main ad row (status remains draft)
      const { error: adError } = await supabase.from('ads').update({
        title: formData.title,
        description: formData.description,
        slug,
        category_id: formData.category_id,
        city_id: formData.city_id,
        package_id: formData.package_id,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone.trim() ? formData.contact_phone : null,
        website_url: formData.website_url.trim() ? formData.website_url : null,
        price: formData.price.trim() ? parseFloat(formData.price) : null,
      }).eq('id', adId);

      if (adError) throw adError;

      // 2) Replace ad media
      const validMediaUrls = mediaUrls.map((u) => u.trim()).filter(Boolean);

      // Keep at least one media URL; DB schema requires original_url not null.
      if (validMediaUrls.length === 0) {
        throw new Error('Please add at least one media URL');
      }

      const { error: deleteMediaError } = await supabase
        .from('ad_media')
        .delete()
        .eq('ad_id', adId);

      if (deleteMediaError) throw deleteMediaError;

      const mediaRecords = validMediaUrls.slice(0, 10).map((url, index) => ({
        ad_id: adId,
        original_url: url,
        source_type: 'direct_image',
        is_primary: index === 0,
        sort_order: index,
      }));

      const { error: insertMediaError } = await supabase.from('ad_media').insert(mediaRecords);
      if (insertMediaError) throw insertMediaError;

      // 3) Update pending payment amount/package (if a pending payment exists)
      const selectedPackage = packages.find((p) => p.id === formData.package_id);
      if (selectedPackage) {
        const { error: paymentError } = await supabase
          .from('payments')
          .update({
            package_id: selectedPackage.id,
            amount: selectedPackage.price,
            currency: 'PKR',
          })
          .eq('ad_id', adId)
          .eq('user_id', user.id)
          .eq('status', 'pending');

        if (paymentError) throw paymentError;
      }

      toast.success('Ad updated successfully!');
      router.push(`/dashboard/ads/${adId}`);
      router.refresh();
    } catch (error: any) {
      console.error('Edit ad error:', error);
      toast.error(error?.message || 'Failed to update ad');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <ArrowLeft className="w-4 h-4 mr-2 inline-block" />
          <Button
            variant="ghost"
            className="px-0"
            onClick={() => router.push(`/dashboard/ads/${adId}`)}
          >
            Back to Ad
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Edit Ad</CardTitle>
            <CardDescription>Update your draft sponsored listing</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Ad Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter a compelling title"
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
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your offering in detail"
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
                    onChange={(e) => setFormData((prev) => ({ ...prev, category_id: e.target.value }))}
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
                    onChange={(e) => setFormData((prev) => ({ ...prev, city_id: e.target.value }))}
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
                  onChange={(e) => setFormData((prev) => ({ ...prev, package_id: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="">Select package</option>
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} - Rs {Number(pkg.price).toLocaleString('en-PK')} ({pkg.duration_days} days)
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
                    onChange={(e) => setFormData((prev) => ({ ...prev, contact_email: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    type="tel"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, contact_phone: e.target.value }))}
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
                    onChange={(e) => setFormData((prev) => ({ ...prev, website_url: e.target.value }))}
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
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <Label>Media URLs (Images/YouTube) *</Label>
                <p className="text-xs text-muted-foreground mb-2">Add direct image URLs</p>
                <div className="space-y-2">
                  {mediaUrls.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={url}
                        onChange={(e) => updateMediaUrl(index, e.target.value)}
                        placeholder="https://example.com/image.jpg"
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
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push(`/dashboard/ads/${adId}`)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

