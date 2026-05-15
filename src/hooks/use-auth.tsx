import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "pmo" | "manager" | "rm" | "associate";

type AuthState = {
  user: User | null;
  session: Session | null;
  roles: AppRole[];
  loading: boolean;
  hasRole: (r: AppRole) => boolean;
  hasAnyRole: (rs: AppRole[]) => boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

async function fetchRoles(userId: string): Promise<AppRole[]> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  if (error) {
    console.error("[auth] roles fetch failed", error);
    return [];
  }
  return (data ?? []).map((r) => r.role as AppRole);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        // Defer Supabase calls to avoid auth deadlocks
        setTimeout(() => {
          fetchRoles(sess.user.id).then(setRoles);
        }, 0);
      } else {
        setRoles([]);
      }
    });

    // THEN check existing session
    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        fetchRoles(sess.user.id).then((rs) => {
          setRoles(rs);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const hasRole = useCallback((r: AppRole) => roles.includes(r), [roles]);
  const hasAnyRole = useCallback((rs: AppRole[]) => rs.some((r) => roles.includes(r)), [roles]);
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, roles, loading, hasRole, hasAnyRole, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

const DEFAULT_AUTH: AuthState = {
  user: null,
  session: null,
  roles: [],
  loading: true,
  hasRole: () => false,
  hasAnyRole: () => false,
  signOut: async () => {},
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  return ctx ?? DEFAULT_AUTH;
}
