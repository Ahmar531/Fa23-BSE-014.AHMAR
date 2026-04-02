'use client';

import { createBrowserClient } from '@supabase/ssr';
import { getSupabasePublicConfigStatus } from './config';

/**
 * Creates a Supabase client for CLIENT components.
 * Uses browser-based cookie storage for auth sessions.
 */
export function createClient() {
  const config = getSupabasePublicConfigStatus();
  const supabaseUrl = config.url;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!config.isConfigured || !supabaseUrl || !supabaseKey) {
    console.warn(config.reason ?? 'Supabase is not configured. Please add valid credentials.');
    // Return a mock client that won't crash
    return {
      auth: {
        signUp: async () => ({ data: null, error: new Error(config.reason ?? 'Supabase not configured') }),
        signInWithPassword: async () => ({ data: null, error: new Error(config.reason ?? 'Supabase not configured') }),
        resetPasswordForEmail: async () => ({ data: null, error: new Error(config.reason ?? 'Supabase not configured') }),
        exchangeCodeForSession: async () => ({ data: { session: null, user: null }, error: new Error(config.reason ?? 'Supabase not configured') }),
        verifyOtp: async () => ({ data: { user: null, session: null }, error: new Error(config.reason ?? 'Supabase not configured') }),
        setSession: async () => ({ data: { user: null, session: null }, error: new Error(config.reason ?? 'Supabase not configured') }),
        updateUser: async () => ({ data: { user: null }, error: new Error(config.reason ?? 'Supabase not configured') }),
        signOut: async () => ({ error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({
          data: {
            subscription: {
              unsubscribe: () => undefined,
            },
          },
        }),
      },
      from: () => ({
        select: () => ({ data: null, error: new Error(config.reason ?? 'Supabase not configured') }),
        insert: () => ({ data: null, error: new Error(config.reason ?? 'Supabase not configured') }),
        update: () => ({ data: null, error: new Error(config.reason ?? 'Supabase not configured') }),
        delete: () => ({ data: null, error: new Error(config.reason ?? 'Supabase not configured') }),
      }),
    } as any;
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
