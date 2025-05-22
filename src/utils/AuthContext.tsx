'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  Session,
  AuthError,
  SignInWithPasswordCredentials
} from '@supabase/supabase-js';
import { supabase } from './supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (data: { email: string; password: string; options?: { data?: Record<string, any>; emailRedirectTo?: string } }) =>
    Promise<{ data: { user: User | null; session: Session | null } | null; error: AuthError | null }>;
  signIn: (data: SignInWithPasswordCredentials) =>
    Promise<{ data: { user: User | null; session: Session | null } | null; error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for active session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUser(session?.user || null);
        }
      );

      return () => subscription?.unsubscribe();
    };

    getSession();
  }, []);

  const value = {
    signUp: (data: { email: string; password: string; options?: { data?: Record<string, any>; emailRedirectTo?: string } }) =>
      supabase.auth.signUp(data),
    signIn: (data: SignInWithPasswordCredentials) =>
      supabase.auth.signInWithPassword(data),
    signOut: () => supabase.auth.signOut(),
    user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};