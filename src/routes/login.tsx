import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/use-auth";
import { CocaColaMark } from "@/components/coca-cola-mark";
import { Sparkles, Mail, Lock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: typeof s.redirect === "string" ? s.redirect : "/",
  }),
  head: () => ({
    meta: [
      { title: "Sign in · ACCM" },
      { name: "description", content: "Sign in to ACCM — the AI-native workforce intelligence platform." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const search = Route.useSearch();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: search.redirect || "/" });
    }
  }, [loading, user, navigate, search.redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName || email.split("@")[0] },
          },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError(result.error instanceof Error ? result.error.message : "Google sign-in failed");
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left: hero */}
      <div className="hidden lg:flex relative flex-col justify-between p-10 bg-gradient-aurora overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-40 pointer-events-none" />
        <div className="relative flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-gradient-brand grid place-items-center shadow-glow">
            <span className="font-script text-base text-white leading-none">C</span>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight">ACCM</p>
            <p className="text-[11px] text-muted-foreground">
              for <CocaColaMark className="text-[13px]" />
            </p>
          </div>
        </div>

        <div className="relative space-y-6 max-w-md">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 backdrop-blur px-3 py-1 text-[11px] font-medium">
            <Sparkles className="h-3 w-3 text-brand" />
            AI-Native Workforce OS
          </div>
          <h1 className="text-display text-4xl xl:text-5xl leading-tight">
            Talent intelligence,<br />designed as a workflow.
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Skills, demand, projects, and people — orchestrated in one intelligent ecosystem.
            Sign in to access your workspace.
          </p>
        </div>

        <div className="relative text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} ACCM · Active Competency Cluster Model
        </div>
      </div>

      {/* Right: auth form */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-gradient-brand grid place-items-center shadow-glow">
              <span className="font-script text-base text-white leading-none">C</span>
            </div>
            <span className="text-sm font-semibold tracking-tight">ACCM</span>
          </div>

          <h2 className="text-display text-2xl">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Sign in to continue to your workspace."
              : "New here? You'll be added as an Associate by default."}
          </p>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={busy}
            className="mt-6 w-full h-10 rounded-md border border-border bg-surface-elevated hover:bg-muted transition flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50"
          >
            <GoogleIcon /> Continue with Google
          </button>

          <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            or email
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "signup" && (
              <Field
                icon={<UserIcon />}
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={setFullName}
              />
            )}
            <Field
              icon={<Mail className="h-4 w-4" />}
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={setEmail}
              required
            />
            <Field
              icon={<Lock className="h-4 w-4" />}
              type="password"
              placeholder="Password"
              value={password}
              onChange={setPassword}
              required
              minLength={6}
            />

            {error && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full h-10 rounded-md bg-gradient-brand text-brand-foreground text-sm font-medium shadow-sm hover:opacity-95 transition flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
              {!busy && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError(null);
              }}
              className="font-medium text-brand hover:underline"
            >
              {mode === "signin" ? "Create one" : "Sign in"}
            </button>
          </p>

          <p className="mt-6 text-center text-[11px] text-muted-foreground">
            <Link to="/" className="hover:underline">← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon,
  type,
  placeholder,
  value,
  onChange,
  required,
  minLength,
}: {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <label className="relative block">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        minLength={minLength}
        className="w-full h-10 pl-9 pr-3 rounded-md bg-muted text-sm placeholder:text-muted-foreground border border-transparent focus:outline-none focus:bg-surface-elevated focus:border-border focus:ring-2 focus:ring-ring/20 transition"
      />
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.96h5.52c-.24 1.44-1.68 4.2-5.52 4.2-3.36 0-6.12-2.76-6.12-6.36S8.64 5.64 12 5.64c1.92 0 3.18.84 3.9 1.5l2.64-2.52C16.86 3.06 14.64 2.04 12 2.04 6.6 2.04 2.28 6.36 2.28 12s4.32 9.96 9.72 9.96c5.6 0 9.36-3.96 9.36-9.54 0-.66-.06-1.14-.18-1.62H12z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1-3.5 4-5.5 7-5.5s6 2 7 5.5" strokeLinecap="round" />
    </svg>
  );
}
