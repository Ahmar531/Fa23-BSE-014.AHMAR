import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase, isMocked } from '../lib/supabase';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Track whether we are inside an explicit login/register call so we can
  // skip the duplicate onAuthStateChange processing.
  const skipNextAuthChange = useRef(false);

  // ─── helpers ──────────────────────────────────────────────────────────────

  const upsertProfile = async (authUser, overrides = {}) => {
    const meta = authUser.user_metadata || {};
    const payload = {
      id:        authUser.id,
      email:     authUser.email,
      full_name: overrides.full_name || meta.full_name || authUser.email.split('@')[0],
      role:      overrides.role      || meta.role      || 'patient',
      phone:     overrides.phone     || meta.phone     || null,
    };
    // upsert so it works whether or not the row already exists
    const { data, error } = await supabase
      .from('users')
      .upsert([payload], { onConflict: 'id' })
      .select()
      .single();
    if (error) throw error;
    return data;
  };

  const loadProfile = async (authUser) => {
    setAuthError(null);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (!error && data) {
        setProfile(data);
        return data;
      }

      // Row missing → auto-create from auth metadata
      const created = await upsertProfile(authUser);
      setProfile(created);
      return created;
    } catch (err) {
      console.error('loadProfile error:', err);
      setProfile(null);
      setAuthError('Could not load your profile. Please try logging in again.');
      return null;
    }
  };

  // ─── Auth state listener (single source of truth) ─────────────────────────
  useEffect(() => {
    let mounted = true;

    // 1. restore existing session on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        setUser(session.user);
        await loadProfile(session.user);
      }
      setLoading(false);
    }).catch((err) => {
      console.error('getSession error:', err);
      if (mounted) setLoading(false);
    });

    // 2. listen for future auth changes (sign-in from email link, sign-out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        // Skip if our own login() / register() is handling it
        if (skipNextAuthChange.current) {
          skipNextAuthChange.current = false;
          return;
        }

        if (session?.user) {
          setUser(session.user);
          setLoading(true);
          await loadProfile(session.user);
          setLoading(false);
        } else {
          setUser(null);
          setProfile(null);
          setAuthError(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Auth actions ─────────────────────────────────────────────────────────

  const login = async ({ email, password }) => {
    skipNextAuthChange.current = true; // we handle state ourselves below
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { skipNextAuthChange.current = false; throw error; }
      if (!data?.user) { skipNextAuthChange.current = false; throw new Error('Login failed: no user returned.'); }

      const profileData = await loadProfile(data.user);
      setUser(data.user); // ensure user state is set

      toast.success('Welcome back! 👋');
      return { ...data, profile: profileData };
    } catch (err) {
      skipNextAuthChange.current = false;
      throw err;
    }
  };

  const register = async ({ email, password, fullName, role, phone }) => {
    const selectedRole = role || 'patient';

    skipNextAuthChange.current = true;
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, role: selectedRole, phone: phone || null } },
      });
      if (error) { skipNextAuthChange.current = false; throw error; }

      // Always write the profile row immediately (even if email confirmation is required).
      // This ensures the row exists when the user later confirms and logs in.
      try {
        await upsertProfile(data.user, { full_name: fullName, role: selectedRole, phone: phone || null });
      } catch (profileErr) {
        console.warn('Profile upsert on register failed (non-fatal):', profileErr.message);
      }

      if (isMocked) {
        // mock mode: sign in straight away
        const loginResult = await supabase.auth.signInWithPassword({ email, password });
        if (loginResult.data?.user) {
          setUser(loginResult.data.user);
          const p = await loadProfile(loginResult.data.user);
          toast.success('Account created! Welcome to DoctorHub 🎉');
          return { ...loginResult.data, profile: p };
        }
      } else if (data.session) {
        // Email confirmation OFF → user is already signed in
        setUser(data.user);
        const p = await loadProfile(data.user);
        toast.success('Account created! Welcome to DoctorHub 🎉');
        return { ...data, profile: p };
      } else {
        // Email confirmation required
        skipNextAuthChange.current = false;
        toast.success('Registration successful! Check your email to confirm your account.');
        return data;
      }
    } catch (err) {
      skipNextAuthChange.current = false;
      throw err;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setAuthError(null);
    toast.success('Logged out successfully');
  };

  const forgotPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
    toast.success('Password reset email sent!');
  };

  // ─── Context value ─────────────────────────────────────────────────────────
  const value = {
    user,
    profile,
    loading,
    authError,
    login,
    register,
    logout,
    forgotPassword,
    fetchProfile: loadProfile,
    isPatient:    profile?.role === 'patient',
    isDoctor:     profile?.role === 'doctor',
    isAssistant:  profile?.role === 'assistant',
    isAdmin:      profile?.role === 'admin',
    isSuperAdmin: profile?.role === 'super_admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
