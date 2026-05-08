'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { UserRole } from '@/lib/types';
import { normalizeRole } from '@/lib/roles';

export function StaffClientFallback(props: {
  loginPath: string;
  allowedRoles?: UserRole[];
  unauthorizedPath?: string;
}) {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function verifySession() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (cancelled) return;

      if (!user) {
        router.replace(props.loginPath);
        return;
      }

      if (!props.allowedRoles?.length) {
        return;
      }

      const [{ data: profile }, { data: appUser }] = await Promise.all([
        supabase
          .from('profiles')
          .select('role, disabled')
          .eq('id', user.id)
          .maybeSingle(),
        supabase
          .from('users')
          .select('role, deleted_at')
          .eq('id', user.id)
          .maybeSingle(),
      ]);

      if (cancelled) return;

      const resolvedRole = normalizeRole(profile?.role ?? appUser?.role) ?? 'client';
      const isDisabled = Boolean(profile?.disabled || appUser?.deleted_at);

      if (isDisabled || !props.allowedRoles.includes(resolvedRole)) {
        router.replace(props.unauthorizedPath ?? '/unauthorized');
      }
    }

    verifySession();

    return () => {
      cancelled = true;
    };
  }, [router, props.allowedRoles, props.loginPath, props.unauthorizedPath]);

  return null;
}
