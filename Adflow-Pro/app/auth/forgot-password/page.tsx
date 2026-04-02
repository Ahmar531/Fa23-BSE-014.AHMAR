'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, LockKeyhole, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (error) {
        throw error;
      }

      await supabase.auth.signOut();
      toast.success('Password updated successfully. Please sign in again.');
      router.push('/auth/login');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update password. Please ensure you have an active session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.16),_transparent_28%),linear-gradient(180deg,_#fffdf8_0%,_#ffffff_48%,_#f8fafc_100%)] px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <Card className="rounded-[2rem] border-slate-200 bg-white/85 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <CardContent className="p-8">
            <div className="mb-6">
              <Link href="/" className="text-lg font-semibold text-slate-950">
                AdFlow Pro
              </Link>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight">
                Reset your password
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Enter your new password below to update it directly.
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  type="password"
                  minLength={8}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, password: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  minLength={8}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                  }
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-slate-950 py-6 text-base hover:bg-slate-800"
              >
                {loading ? 'Updating password...' : 'Update Password'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <p className="mt-5 text-sm text-slate-600">
              Remembered it?{' '}
              <Link href="/auth/login" className="font-medium text-orange-600 hover:text-orange-500">
                Return to sign in
              </Link>
            </p>
          </CardContent>
        </Card>

        <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-[0_40px_120px_rgba(15,23,42,0.24)]">
          <p className="text-xs uppercase tracking-[0.35em] text-orange-300">
            Password Update
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Update your password directly without email verification.
          </h2>
          <div className="mt-6 space-y-4 text-sm leading-7 text-slate-300">
            <div className="flex items-start gap-3 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <LockKeyhole className="mt-1 h-5 w-5 text-orange-300" />
              <p>
                As requested, the email link step has been removed. You can enter your new password directly here.
              </p>
            </div>
            <div className="flex items-start gap-3 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <ShieldCheck className="mt-1 h-5 w-5 text-orange-300" />
              <p>
                After saving the new password, you will be directed back to the login screen with the updated credentials.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
