'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type AdminStatus = 'all' | 'pending' | 'approved' | 'rejected' | 'active';
type AdWriteStatus = 'pending' | 'approved' | 'rejected' | 'active';

type AdminAd = {
  id: string;
  title: string;
  slug: string;
  status: string;
  created_at: string;
  review_note: string | null;
  reviewed_at: string | null;
  user?: { email?: string; full_name?: string };
};

export function AdminAdsTable() {
  const [ads, setAds] = useState<AdminAd[]>([]);
  const [status, setStatus] = useState<AdminStatus>('all');
  const [loading, setLoading] = useState(true);
  const [busyAdId, setBusyAdId] = useState<string | null>(null);

  const loadAds = async (currentStatus: AdminStatus) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/ads?status=${currentStatus}`, { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.error ?? 'Failed to load ads');
      setAds(payload.data ?? []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load ads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAds(status);
  }, [status]);

  const updateStatus = async (id: string, nextStatus: AdWriteStatus) => {
    setBusyAdId(id);
    try {
      const response = await fetch(`/api/admin/ads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.error ?? 'Failed to update status');
      toast.success('Ad status updated');
      loadAds(status);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update ad status');
    } finally {
      setBusyAdId(null);
    }
  };

  const deleteAd = async (id: string) => {
    const confirmed = window.confirm('Delete this ad? This action will hide it from the marketplace.');
    if (!confirmed) return;

    setBusyAdId(id);
    try {
      const response = await fetch(`/api/admin/ads/${id}`, { method: 'DELETE' });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.error ?? 'Failed to delete ad');
      toast.success('Ad deleted');
      setAds((prev) => prev.filter((ad) => ad.id !== id));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete ad');
    } finally {
      setBusyAdId(null);
    }
  };

  return (
    <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <CardContent className="p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Ads Management</h2>
          <Select value={status} onValueChange={(value) => setStatus(value as AdminStatus)}>
            <SelectTrigger className="w-[180px] rounded-xl">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="active">Active</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="grid gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-16 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        ) : ads.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-600">
            No ads found for this filter.
          </div>
        ) : (
          <div className="space-y-3">
            {ads.map((ad) => (
              <div key={ad.id} className="grid gap-3 rounded-2xl border border-slate-200 p-4 lg:grid-cols-[1.2fr_0.8fr_0.6fr] lg:items-center">
                <div>
                  <p className="font-medium text-slate-900">{ad.title}</p>
                  <p className="text-sm text-slate-600">{ad.user?.full_name || ad.user?.email}</p>
                  <p className="text-xs text-slate-500">Created: {new Date(ad.created_at).toLocaleString()}</p>
                  <p className="text-xs text-slate-500">Workflow status: {ad.status}</p>
                  {ad.review_note ? <p className="mt-2 text-sm text-slate-600">{ad.review_note}</p> : null}
                </div>

                <Select
                  onValueChange={(value) => updateStatus(ad.id, value as AdWriteStatus)}
                  disabled={busyAdId === ad.id}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder={busyAdId === ad.id ? 'Updating...' : 'Update status'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex justify-end">
                  <Button
                    variant="destructive"
                    className="rounded-full"
                    onClick={() => deleteAd(ad.id)}
                    disabled={busyAdId === ad.id}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {busyAdId === ad.id ? 'Working...' : 'Delete'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
