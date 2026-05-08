import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getSupabasePublicConfigStatus } from '@/lib/supabase/config';
import {
  canAccessProtectedPortal,
  getLoginPathForProtectedPortal,
  getProtectedPortalFromPath,
  getRoleHomePath,
  normalizeRole,
} from '@/lib/roles';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Skip middleware if Supabase is not configured
  if (!getSupabasePublicConfigStatus().isConfigured) {
    return response;
  }

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Refresh session if expired
    await supabase.auth.getUser();

    const path = request.nextUrl.pathname;
    
    // Redirect old login pages to unified login
    if (path === '/admin/login' || path === '/moderator/login') {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    
    // Skip middleware for login pages and public routes
    const publicPaths = [
      '/auth/login',
      '/auth/register', 
      '/auth/callback',
      '/unauthorized',
      '/api/auth',
    ];
    
    const isPublicPath = publicPaths.some((p) => path.startsWith(p));
    
    if (isPublicPath) {
      return response;
    }
    
    const matchedProtectedPortal = getProtectedPortalFromPath(path);
    const isProtectedPath = Boolean(matchedProtectedPortal);

    // Handle protected routes
    if (isProtectedPath) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Not logged in - redirect to unified login
      if (!user) {
        const redirectUrl = new URL('/auth/login', request.url);
        redirectUrl.searchParams.set('redirect', path);
        return NextResponse.redirect(redirectUrl);
      }

      // Get user role from database
      const [{ data: appUser }, { data: profile }] = await Promise.all([
        supabase
          .from('users')
          .select('role, deleted_at')
          .eq('id', user.id)
          .maybeSingle(),
        supabase
          .from('profiles')
          .select('role, disabled')
          .eq('id', user.id)
          .maybeSingle(),
      ]);

      const currentRole = normalizeRole(profile?.role ?? appUser?.role) ?? 'client';
      const isDisabled = Boolean(profile?.disabled || appUser?.deleted_at);

      // Disabled users go to unauthorized
      if (isDisabled) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }

      // Role-based access control
      if (matchedProtectedPortal === 'super_admin' && currentRole !== 'super_admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }

      if (matchedProtectedPortal === 'admin' && !['admin', 'super_admin'].includes(currentRole)) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }

      if (matchedProtectedPortal === 'moderator' && !['moderator', 'admin', 'super_admin'].includes(currentRole)) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }

      // Client dashboard - redirect other roles to their proper dashboards
      if (matchedProtectedPortal === 'client' && currentRole !== 'client') {
        const homePath = getRoleHomePath(currentRole);
        return NextResponse.redirect(new URL(homePath, request.url));
      }
    }

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    return response;
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
