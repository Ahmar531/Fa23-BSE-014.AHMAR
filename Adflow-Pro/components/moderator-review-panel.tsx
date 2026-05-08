'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { Clock3, ShieldCheck, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getPlaceholderImage } from '@/lib/media';
import { getModerationViewForStatus } from '@/lib/moderation';

type QueueFilter = 'pending' | 'approved' | 'rejected' | 'all';

type QueueAd = {
  id: string;
  title: string;
  description: string;
  slug: string;
  status: string;
  created_at: string;
  review_note: string | null;
  reviewed_at: string | null;
  user?: { email?: string; full_name?: string };
  media?: Array<{ id: string; normalized_thumbnail_url: string | null; original_url: string | null }>;
};

const VALID_FILTERS: QueueFilter[] = ['pending', 'approved', 'rejected', 'all'];

function getSafeFilter(value: string | null | undefined, fallback: QueueFilter = 'pending'): QueueFilter {
  return VALID_FILTERS.includes(value as QueueFilter) ? (value as QueueFilter) : fallback;
}

export function ModeratorReviewPanel(props: { initialStatus?: QueueFilter }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<QueueFilter>(props.initialStatus ?? 'pending');
  const [queue, setQueue] = useState<QueueAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyAdId, setBusyAdId] = useState<string | null>(null);
  const [noteByAd, setNoteByAd] = useState<Record<string, string>>({});

  const loadQueue = async (nextStatus: QueueFilter) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/moderator/review-queue?status=${nextStatus}`, { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? 'Failed to load review queue');
      }

      setQueue(payload.data ?? []);
    } catch (error) {
      setQueue([]);
      toast.error(error instanceof Error ? error.message : 'Failed to load review queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const nextStatus = getSafeFilter(searchParams.get('status'), props.initialStatus ?? 'pending');
    if (nextStatus !== status) {
      setStatus(nextStatus);
    }
  }, [props.initialStatus, searchParams, status]);

  useEffect(() => {
    void loadQueue(status);
  }, [status]);

  const handleStatusChange = (nextStatus: QueueFilter) => {
    setStatus(nextStatus);

    const params = new URLSearchParams(searchParams.toString());
    if (nextStatus === 'pending') {
      params.delete('status');
    } else {
      params.set('status', nextStatus);
    }

    const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(nextUrl);
  };

  const review = async (adId: string, action: 'approve' | 'reject') => {
    if (action === 'reject' && !noteByAd[adId]?.trim()) {
      toast.error('Please provide a rejection reason.');
      return;
    }

    const confirmed = window.confirm(
      action === 'approve' ? 'Approve this ad?' : 'Reject this ad? This will record the reason.'
    );

    if (!confirmed) return;

    setBusyAdId(adId);

    try {
      const response = await fetch(`/api/moderator/ads/${adId}/review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          notes: noteByAd[adId] || undefined,
          rejection_reason: action === 'reject' ? noteByAd[adId] : undefined,
        }),
      });

      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? 'Failed to update review');
      }

      toast.success(action === 'approve' ? 'Ad approved' : 'Ad rejected');
      setNoteByAd((prev) => ({ ...prev, [adId]: '' }));

      if (status === 'pending') {
        setQueue((prev) => prev.filter((ad) => ad.id !== adId));
      } else {
        await loadQueue(status);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update review');
    } finally {
      setBusyAdId(null);
    }
  };

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            label: 'Current Filter',
            value: status.charAt(0).toUpperCase() + status.slice(1),
            icon: <ShieldCheck className="h-5 w-5 text-sky-500" />,
          },
          {
            label: 'Queue Size',
            value: String(queue.length),
            icon: <Clock3 className="h-5 w-5 text-orange-500" />,
          },
          {
            label: 'Rejected Notes Required',
            value: 'Yes',
            icon: <XCircle className="h-5 w-5 text-rose-500" />,
          },
        ].map((item) => (
          <Card key={item.label} className="rounded-3xl border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">{item.label}</p>
                {item.icon}
              </div>
              <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <CardContent className="p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Moderation Queue</h2>
              <p className="mt-1 text-sm text-slate-600">
                Review submitted ads, record notes, and keep the workflow moving clearly.
              </p>
            </div>
            <Select value={status} onValueChange={(value) => handleStatusChange(value as QueueFilter)}>
              <SelectTrigger className="w-[180px] rounded-xl">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="grid gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-28 animate-pulse rounded-2xl bg-slate-100" />
              ))}
            </div>
          ) : queue.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-600">
              No ads found for this filter.
            </div>
          ) : (
            <div className="space-y-4">
              {queue.map((ad) => {
                const moderationView = getModerationViewForStatus(ad.status);
                const canReview = moderationView === 'pending';
                const currentNote = noteByAd[ad.id] ?? '';

                return (
                  <div key={ad.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-lg font-semibold text-slate-900">{ad.title}</p>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-600">
                            {moderationView ?? ad.status}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-600">
                          {ad.user?.full_name || ad.user?.email} - {new Date(ad.created_at).toLocaleString()}
                        </p>
                        <p className="mt-3 text-sm leading-7 text-slate-700">{ad.description}</p>

                        <div className="mt-3 grid gap-2 sm:grid-cols-3">
                          {(ad.media ?? []).slice(0, 3).map((media) => (
                            <Image
                              key={media.id}
                              src={media.normalized_thumbnail_url || media.original_url || getPlaceholderImage()}
                              alt={ad.title}
                              width={260}
                              height={160}
                              className="h-24 w-full rounded-xl object-cover"
                            />
                          ))}
                          {(ad.media ?? []).length === 0 ? (
                            <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-500">
                              No Images
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="space-y-3">
                        {canReview ? (
                          <>
                            <Textarea
                              placeholder="Add review note (required for rejection)"
                              value={currentNote}
                              onChange={(event) =>
                                setNoteByAd((prev) => ({ ...prev, [ad.id]: event.target.value }))
                              }
                              className="min-h-24"
                            />

                            <div className="grid grid-cols-2 gap-2">
                              <Button
                                className="rounded-full bg-emerald-600 hover:bg-emerald-700"
                                onClick={() => review(ad.id, 'approve')}
                                disabled={busyAdId === ad.id}
                              >
                                {busyAdId === ad.id ? 'Working...' : 'Approve'}
                              </Button>
                              <Button
                                variant="destructive"
                                className="rounded-full"
                                onClick={() => review(ad.id, 'reject')}
                                disabled={busyAdId === ad.id}
                              >
                                {busyAdId === ad.id ? 'Working...' : 'Reject'}
                              </Button>
                            </div>
                          </>
                        ) : (
                          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4">
                            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Review Summary</p>
                            <p className="mt-3 text-sm leading-7 text-slate-700">
                              {ad.review_note || 'No review note was recorded for this ad.'}
                            </p>
                            {ad.reviewed_at ? (
                              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-400">
                                Reviewed {new Date(ad.reviewed_at).toLocaleString()}
                              </p>
                            ) : null}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
