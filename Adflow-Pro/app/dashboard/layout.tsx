import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import { ALL_USER_ROLES } from '@/lib/roles';
import { StaffClientFallback } from '@/components/staff-client-fallback';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  try {
    await requireAuth();

    return (
      <>
        <StaffClientFallback loginPath="/auth/login" allowedRoles={[...ALL_USER_ROLES]} />
        {children}
      </>
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      redirect('/auth/login');
    }

    redirect('/unauthorized');
  }
}
