import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
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

  const fetchProfile = async (userId) => {
    try {
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
      return null;
    }
  };

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      }
      setLoading(false);
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const register = async ({ email, password, fullName, role, phone }) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    const userId = data.user.id;

    const { error: profileError } = await supabase.from('users').insert([{
      id: userId,
      email,
      full_name: fullName,
      role: role || 'patient',
      phone: phone || null,
    }]);
    if (profileError) throw profileError;

    // Auto-login if mocked to bypass email verification during preview/testing
    const { isMocked } = await import('../lib/supabase');
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
    await fetchProfile(data.user.id);
    toast.success('Welcome back!');
    return data;
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
    isPatient: profile?.role === 'patient',
    isDoctor: profile?.role === 'doctor',
    isAssistant: profile?.role === 'assistant',
    isAdmin: profile?.role === 'admin',
    isSuperAdmin: profile?.role === 'super_admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
