import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{ error: any; data?: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any; data?: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔹 Handle session persistence and auth state changes
  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange((_event: string, session: React.SetStateAction<Session | null>) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (_event === 'SIGNED_IN') navigate('/dashboard');
      if (_event === 'SIGNED_OUT') navigate('/auth');
    });

    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
      })
      .catch((err) => console.error('Error fetching initial session:', err))
      .finally(() => setLoading(false));

    return () => subscription?.unsubscribe();
  }, [navigate]);

  // 🔹 Sign In
  const signIn = async (email: string, password: string) => {
    if (!email || !password) {
      toast.error('Email and password are required');
      return { error: 'Missing email or password' };
    }

    setLoading(true);
    console.log('Signing in with:', { email, password });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        console.error('Sign-in error:', error);
        toast.error(error.message || 'Failed to sign in');
      } else if (data?.user) {
        toast.success('Welcome back!');
        setUser(data.user);
        setSession(data.session);
        navigate('/dashboard');
      }

      return { error, data };
    } catch (err) {
      console.error('Unexpected sign-in error:', err);
      toast.error('An unexpected error occurred during sign in');
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Sign Up
  const signUp = async (email: string, password: string, fullName: string) => {
    if (!email || !password || !fullName) {
      toast.error('All fields are required for signup');
      return { error: 'Missing required fields' };
    }

    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/auth/callback`; // optional redirect path

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          emailRedirectTo: redirectUrl,
          data: { full_name: fullName },
        },
      });

      if (error) {
        console.error('Signup error:', error);
        toast.error(error.message);
      } else {
        toast.success('Account created successfully! Please verify your email.');
      }

      return { error, data };
    } catch (err) {
      console.error('Unexpected signup error:', err);
      toast.error('An unexpected error occurred during sign up');
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Sign Out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      navigate('/auth');
      toast.success('Signed out successfully');
    } catch (err) {
      console.error('Sign-out error:', err);
      toast.error('Failed to sign out');
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
