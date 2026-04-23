import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/database/supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialSession() {
      try {
        const {
          data: { session }
        } = await supabase.auth.getSession();

        if (isMounted) {
          setSession(session ?? null);
          setUser(session?.user ?? null);
          setAuthLoading(false);
        }
      } catch {
        if (isMounted) {
          setAuthLoading(false);
        }
      }
    }

    loadInitialSession();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? null);
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    return { data, error };
  }

  async function signUp(email, password, userMetadata = {}) {
    const emailRedirectTo = window.location.origin;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userMetadata,
        emailRedirectTo
      }
    });

    return { data, error };
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  }


  async function sendPasswordResetEmail(email) {
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo }
    );
    return { error };
  }

  async function updatePassword(newPassword) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });
    return { data, error };
  }

  const value = {
    session,
    user,
    authLoading,
    signIn,
    signUp,
    signOut,
    sendPasswordResetEmail,
    updatePassword,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}