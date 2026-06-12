'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

interface AdminProfile {
  id: string;
  name: string;
  role: 'admin' | 'editor';
  avatar_url: string | null;
  email: string;
}

interface AdminAuthContextType {
  user: AdminProfile | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile(authUser: User) {
    const { data } = await supabase
      .from('admin_profiles')
      .select('id, name, role, avatar_url')
      .eq('id', authUser.id)
      .maybeSingle() as { data: { id: string; name: string; role: 'admin' | 'editor'; avatar_url: string | null } | null };

    if (data) {
      setUser({ id: data.id, name: data.name, role: data.role, avatar_url: data.avatar_url, email: authUser.email ?? '' });
    } else {
      setUser(null);
      await supabase.auth.signOut();
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) {
        loadProfile(s.user).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (s?.user) {
        (async () => {
          await loadProfile(s.user);
          setLoading(false);
        })();
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    if (!data.user) return { success: false, error: 'Authentication failed.' };

    const { data: profile } = await supabase
      .from('admin_profiles')
      .select('id')
      .eq('id', data.user.id)
      .maybeSingle();

    if (!profile) {
      await supabase.auth.signOut();
      return { success: false, error: 'You do not have admin access.' };
    }

    return { success: true };
  }

  function logout() {
    supabase.auth.signOut();
  }

  async function resetPassword(email: string): Promise<{ error: string | null }> {
    const redirectTo = typeof window !== 'undefined'
      ? `${window.location.origin}/admin/reset-password`
      : undefined;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    return { error: error ? error.message : null };
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, login, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
