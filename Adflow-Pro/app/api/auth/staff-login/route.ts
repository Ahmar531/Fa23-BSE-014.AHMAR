import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getStoredRoleByEmail } from '@/lib/auth';
import { normalizeRole } from '@/lib/roles';

type Scope = 'admin' | 'moderator';

type Payload = {
  scope: Scope;
  email: string;
  password?: string;
  mode?: 'password' | 'magic_link';
};

const SCOPE_ROLES: Record<Scope, string[]> = {
  admin: ['admin', 'super_admin'],
  moderator: ['moderator', 'admin', 'super_admin'],
};

const SCOPE_REDIRECT: Record<Scope, string> = {
  admin: '/admin',
  moderator: '/moderator',
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Payload;
    const scope = body.scope;

    if (!scope || !['admin', 'moderator'].includes(scope)) {
      return NextResponse.json({ success: false, error: 'Invalid login scope.' }, { status: 400 });
    }

    if (!body.email) {
      return NextResponse.json({ success: false, error: 'Email is required.' }, { status: 400 });
    }

    const supabase = await createClient();

    if (body.mode === 'magic_link') {
      const storedRole = await getStoredRoleByEmail(body.email);
      if (storedRole !== undefined && (!storedRole || !SCOPE_ROLES[scope].includes(storedRole))) {
        return NextResponse.json(
          {
            success: false,
            error: 'This account is not authorized for the requested staff portal.',
          },
          { status: 403 }
        );
      }

      const { origin } = new URL(request.url);
      const nextPath = SCOPE_REDIRECT[scope];
      const { error } = await supabase.auth.signInWithOtp({
        email: body.email,
        options: {
          emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
        },
      });

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        mode: 'magic_link',
        message: 'Magic link sent. Open the link from your inbox to continue.',
      });
    }

    if (!body.password) {
      return NextResponse.json({ success: false, error: 'Password is required.' }, { status: 400 });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }

    if (!data.user) {
      return NextResponse.json({ success: false, error: 'Authentication failed.' }, { status: 401 });
    }

    const userId = data.user.id;

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle();

    const { data: appUser } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .maybeSingle();

    const role = normalizeRole(profile?.role ?? appUser?.role);

    if (!role || !SCOPE_ROLES[scope].includes(role)) {
      await supabase.auth.signOut();
      return NextResponse.json(
        {
          success: false,
          error: 'You are authenticated, but your account is not authorized for this portal.',
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      role,
      redirectTo: SCOPE_REDIRECT[scope],
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unable to sign in right now.',
      },
      { status: 500 }
    );
  }
}
