import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase, Profile } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      console.log('Loading profile for user:', userId);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      console.log('Profile query result:', { data, error });

      if (data) {
        console.log('Profile found:', data);
        setProfile(data);
        return;
      }

      if (error) {
        console.warn('Profile query error (likely RLS):', error.message);
      }

      const authUserResponse = await supabase.auth.getUser();
      const authUser = authUserResponse.data?.user;

      if (!authUser) {
        console.error('No authenticated user found');
        setLoading(false);
        return;
      }

      console.log('Creating profile for user:', authUser.email);

      const isAdmin =
        authUser.email === 'eranda.wakista@hnbassurance.com' ||
        authUser.email === 'eranda.wakista@gmail.com';

      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: authUser.email,
          full_name: authUser.user_metadata?.full_name || '',
          role: isAdmin ? 'admin' : 'requestor',
        })
        .select()
        .single();

      if (insertError) {
        console.warn('Insert error:', insertError.message);
        console.log('Using client-side profile');
        setProfile({
          id: userId,
          email: authUser.email || '',
          full_name: authUser.user_metadata?.full_name || '',
          division: null,
          role: isAdmin ? 'admin' : 'requestor',
          created_at: new Date().toISOString(),
        });
      } else if (newProfile) {
        console.log('Profile created successfully:', newProfile);
        setProfile(newProfile);
      }
    } catch (error) {
      console.error('Error in loadProfile:', error);
      const authUserResponse = await supabase.auth.getUser();
      const authUser = authUserResponse.data?.user;

      if (authUser) {
        console.log('Fallback: using client-side profile');
        const isAdmin =
          authUser.email === 'eranda.wakista@hnbassurance.com' ||
          authUser.email === 'eranda.wakista@gmail.com';

        setProfile({
          id: userId,
          email: authUser.email || '',
          full_name: authUser.user_metadata?.full_name || '',
          division: null,
          role: isAdmin ? 'admin' : 'requestor',
          created_at: new Date().toISOString(),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        return { error };
      }

      if (data.session?.user) {
        console.log('Sign in successful, session created');
        setUser(data.session.user);
        await loadProfile(data.session.user.id);
        console.log('Profile loaded after sign in');
      }

      return { error: null };
    } catch (err) {
      console.error('Sign in exception:', err);
      const error = err instanceof Error ? err : new Error('Unknown error');
      return { error: error as unknown as AuthError };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log('Attempting sign up:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        return { error };
      }

      if (data.user) {
        console.log('Sign up successful');
        setUser(data.user);
        await loadProfile(data.user.id);
        console.log('Profile loaded after sign up');
      }

      return { error: null };
    } catch (err) {
      console.error('Sign up exception:', err);
      const error = err instanceof Error ? err : new Error('Unknown error');
      return { error: error as unknown as AuthError };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    window.location.href = '/auth';
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
