import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
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
  const loadingProfile = useRef(false);
  const profileLoaded = useRef(false);

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
      setUser(session?.user ?? null);
      if (!session?.user) {
        setProfile(null);
        setLoading(false);
        profileLoaded.current = false;
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    if (loadingProfile.current || profileLoaded.current) return;
    loadingProfile.current = true;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (data) {
        setProfile(data);
        profileLoaded.current = true;
        return;
      }

      if (error) {
        console.warn('Profile query error:', error.message);
      }

      // Create profile if not found
      const authUserResponse = await supabase.auth.getUser();
      const authUser = authUserResponse.data?.user;
      if (!authUser) { setLoading(false); return; }

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
        // Fallback to client-side profile
        setProfile({
          id: userId,
          email: authUser.email || '',
          full_name: authUser.user_metadata?.full_name || '',
          division: null,
          role: isAdmin ? 'admin' : 'requestor',
          created_at: new Date().toISOString(),
        });
      } else if (newProfile) {
        setProfile(newProfile);
      }

      profileLoaded.current = true;
    } catch (error) {
      console.error('Error in loadProfile:', error);
    } finally {
      setLoading(false);
      loadingProfile.current = false;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      profileLoaded.current = false;
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error };
      if (data.session?.user) {
        setUser(data.session.user);
        await loadProfile(data.session.user.id);
      }
      return { error: null };
    } catch (err) {
      return { error: err as unknown as AuthError };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      profileLoaded.current = false;
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: fullName } },
      });
      if (error) return { error };
      if (data.user) {
        setUser(data.user);
        await loadProfile(data.user.id);
      }
      return { error: null };
    } catch (err) {
      return { error: err as unknown as AuthError };
    }
  };

  const signOut = async () => {
    profileLoaded.current = false;
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
