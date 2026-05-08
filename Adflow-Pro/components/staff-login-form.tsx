'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowRight, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PORTAL_DEFINITIONS } from '@/lib/roles';

type StaffScope = 'admin' | 'moderator';

export function StaffLoginForm(props: {
  scope: StaffScope;
  heading: string;
  description: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [sendingMagicLink, setSendingMagicLink] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const next = searchParams.get('redirect');

  const handlePasswordLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/staff-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scope: props.scope,
          email,
          password,
          mode: 'password',
        }),
      });

      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? 'Unable to sign in.');
      }

      toast.success('Sign-in successful.');
      router.push(next || payload.redirectTo || '/');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      toast.error('Enter your work email first.');
      return;
    }

    setSendingMagicLink(true);
    try {
      const response = await fetch('/api/auth/staff-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scope: props.scope,
          email,
          mode: 'magic_link',
        }),
      });

      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? 'Failed to send magic link.');
      }

      toast.success(payload.message ?? 'Magic link sent.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send magic link.');
    } finally {
      setSendingMagicLink(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.24),_transparent_30%),linear-gradient(180deg,_#fff8f1_0%,_#ffffff_50%,_#f8fafc_100%)] px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-[0_40px_120px_rgba(15,23,42,0.24)]">
          <p className="text-xs uppercase tracking-[0.35em] text-orange-300">AdFlow Pro Staff Access</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{props.heading}</h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-slate-300">{props.description}</p>
        </div>

        <Card className="rounded-[2rem] border-slate-200 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <CardContent className="p-8">
            <h2 className="text-3xl font-semibold tracking-tight">Staff login</h2>
            <p className="mt-2 text-sm text-slate-600">Use your assigned role account credentials.</p>

            <form onSubmit={handlePasswordLogin} className="mt-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full rounded-full bg-slate-950 py-6 text-base hover:bg-slate-800">
                {loading ? 'Signing in...' : 'Continue'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-700">Prefer passwordless access?</p>
              <Button
                type="button"
                variant="outline"
                className="mt-3 w-full rounded-full"
                onClick={handleMagicLink}
                disabled={sendingMagicLink}
              >
                <Mail className="mr-2 h-4 w-4" />
                {sendingMagicLink ? 'Sending link...' : 'Send magic link'}
              </Button>
            </div>

            <p className="mt-5 text-sm text-slate-600">
              Back to{' '}
              <Link href="/auth/login" className="font-medium text-orange-600 hover:text-orange-500">
                standard login
              </Link>
            </p>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Other Modules</p>
              <div className="mt-4 space-y-3">
                {PORTAL_DEFINITIONS.filter((portal) => portal.id !== props.scope).map((portal) => (
                  <Link
                    key={portal.id}
                    href={portal.loginHref}
                    className="flex items-start justify-between gap-4 rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{portal.label}</p>
                      <p className="mt-1 text-sm text-slate-600">{portal.description}</p>
                    </div>
                    <span className="text-sm font-medium text-orange-600">Open</span>
                  </Link>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
