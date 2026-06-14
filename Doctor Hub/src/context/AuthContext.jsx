import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isMocked } from '../lib/supabase';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const fetchProfile = async (userId) => {
    try {
      setAuthError(null);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) throw error;
      setProfile(data);
      return data;
    } catch (err) {
      console.error('Error fetching profile:', err);
      setProfile(null);
      setAuthError('Your account exists, but its role profile is missing. Run the latest Supabase schema and make sure this user has a row in public.users.');
      return null;
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        }
      } catch (err) {
        console.error('Error restoring session:', err);
        setAuthError('Could not restore your session. Please sign in again.');
      } finally {
        setLoading(false);
      }
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setLoading(true);
      try {
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
          setAuthError(null);
        }
      } finally {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const register = async ({ email, password, fullName, role, phone }) => {
    const selectedRole = role || 'patient';
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: selectedRole,
          phone: phone || null,
        },
      },
    });
    if (error) throw error;

    const userId = data.user.id;

    if (isMocked || data.session) {
      const { error: profileError } = await supabase.from('users').insert([{
        id: userId,
        email,
        full_name: fullName,
        role: selectedRole,
        phone: phone || null,
      }]);
      if (profileError && profileError.code !== '23505') throw profileError;
    }

    if (isMocked) {
      await login({ email, password });
    } else {
      toast.success('Registration successful! Please check your email.');
    }
    return data;
  };

  const login = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (!data?.user) throw new Error('Login failed: no user returned.');

    setUser(data.user);
    const profileData = await fetchProfile(data.user.id);
    if (!profileData) {
      await supabase.auth.signOut();
      setUser(null);
      throw new Error('Login successful, but your role profile is missing. Please run the latest Supabase schema or create this user in public.users.');
    }

    toast.success('Welcome back!');
    return { ...data, profile: profileData };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    toast.success('Logged out successfully');
  };

  const forgotPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
    toast.success('Password reset email sent!');
  };

  const value = {
    user,
    profile,
    loading,
    register,
    login,
    logout,
    forgotPassword,
    fetchProfile,
    authError,
    isPatient: profile?.role === 'patient',
    isDoctor: profile?.role === 'doctor',
    isAssistant: profile?.role === 'assistant',
    isAdmin: profile?.role === 'admin',
    isSuperAdmin: profile?.role === 'super_admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
