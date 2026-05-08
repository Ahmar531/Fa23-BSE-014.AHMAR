import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.2),_transparent_35%),linear-gradient(180deg,_#fff7f7_0%,_#ffffff_55%,_#f8fafc_100%)] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl items-center justify-center">
        <div className="w-full rounded-[2rem] border border-rose-100 bg-white/90 p-8 text-center shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          <p className="text-xs uppercase tracking-[0.32em] text-rose-500">Access Restricted</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Unauthorized</h1>
          <p className="mt-4 text-slate-600">
            Your account is authenticated but does not have permission to open this section.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/auth/login">
              <Button className="rounded-full bg-slate-950 hover:bg-slate-800">Go to Login</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="rounded-full">Open Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
