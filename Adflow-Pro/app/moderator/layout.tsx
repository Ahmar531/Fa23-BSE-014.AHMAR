import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { requireRole } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { StaffClientFallback } from '@/components/staff-client-fallback';
import { PortalSidebar } from '@/components/portal-sidebar';

const NAV_ITEMS = [
  { href: '/moderator', label: 'Dashboard', hint: 'Overview and statistics.' },
  { href: '/moderator/pending', label: 'Pending Review', hint: 'Review submitted ads.' },
  { href: '/moderator/approved', label: 'Approved', hint: 'View approved ads.' },
  { href: '/moderator/rejected', label: 'Rejected', hint: 'View rejected ads.' },
];

export const dynamic = 'force-dynamic';

export default async function ModeratorLayout({ children }: { children: ReactNode }) {
  try {
    const user = await requireRole(['moderator', 'admin', 'super_admin']);

    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_15%_10%,_rgba(249,115,22,0.15),_transparent_30%),radial-gradient(circle_at_90%_0%,_rgba(15,23,42,0.12),_transparent_35%),linear-gradient(180deg,_#fff8f2_0%,_#ffffff_50%,_#f8fafc_100%)]">
        <StaffClientFallback loginPath="/moderator/login" allowedRoles={['moderator', 'admin', 'super_admin']} />

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 py-6 lg:grid-cols-[260px_1fr] lg:px-6">
          <PortalSidebar
            user={user}
            currentPortal="moderator"
            title="Moderator Desk"
            description="Review and manage user-submitted ads with moderation tools."
            navItems={NAV_ITEMS}
          />

          <div className="space-y-5">
            <header className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white/90 px-5 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Authenticated as</p>
                <p className="text-lg font-semibold text-slate-900">{user.full_name || user.email}</p>
              </div>
              <form action="/api/auth/logout" method="POST">
                <Button type="submit" variant="outline" className="rounded-full">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </form>
            </header>
            <main>{children}</main>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      redirect('/moderator/login');
    }

    redirect('/unauthorized');
  }
}
