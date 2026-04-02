import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  
  // Redirect to login page after logout
  return NextResponse.redirect(new URL('/auth/login', request.url), { status: 302 });
}
