import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";

const GUEST_ID_KEY = "guest_id";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AuthContextType {
  session: Session | null;
  loading: boolean;
  isGuest: boolean;
  guestId: string | null;
  signInWithGoogle: () => Promise<void>;
  continueAsGuest: () => void;
  signOut: () => Promise<void>;
}

// ── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [guestId, setGuestId] = useState<string | null>(() => localStorage.getItem(GUEST_ID_KEY));

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  };

  const continueAsGuest = () => {
    const id = crypto.randomUUID();
    localStorage.setItem(GUEST_ID_KEY, id);
    setGuestId(id);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem(GUEST_ID_KEY);
    setGuestId(null);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        isGuest: guestId !== null && session === null,
        guestId,
        signInWithGoogle,
        continueAsGuest,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
