import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import USERS_RAW from "@/data/users.json";

export type AppRole = "admin" | "pmo" | "manager" | "rm" | "associate";

export type StaticUser = {
  id: string;
  email: string;
  fullName: string;
  roles: AppRole[];
};

type UserRecord = StaticUser & { password: string };
const USERS = USERS_RAW as UserRecord[];

type AuthState = {
  user: StaticUser | null;
  roles: AppRole[];
  loading: boolean;
  hasRole: (r: AppRole) => boolean;
  hasAnyRole: (rs: AppRole[]) => boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => void;
};

const SESSION_KEY = "accm_session";
const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StaticUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate session from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as StaticUser;
        // Validate the saved user still exists in the static list
        const valid = USERS.find((u) => u.id === saved.id && u.email === saved.email);
        if (valid) {
          setUser({ id: valid.id, email: valid.email, fullName: valid.fullName, roles: valid.roles });
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<{ error: string | null }> => {
    const found = USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (!found) return { error: "Invalid email or password." };
    const session: StaticUser = { id: found.id, email: found.email, fullName: found.fullName, roles: found.roles };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    return { error: null };
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const hasRole = useCallback((r: AppRole) => user?.roles.includes(r) ?? false, [user]);
  const hasAnyRole = useCallback((rs: AppRole[]) => rs.some((r) => user?.roles.includes(r)), [user]);

  return (
    <AuthContext.Provider value={{ user, roles: user?.roles ?? [], loading, hasRole, hasAnyRole, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

const DEFAULT_AUTH: AuthState = {
  user: null,
  roles: [],
  loading: false,
  hasRole: () => false,
  hasAnyRole: () => false,
  signIn: async () => ({ error: "Auth not initialised." }),
  signOut: () => {},
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  return ctx ?? DEFAULT_AUTH;
}
