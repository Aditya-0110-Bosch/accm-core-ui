import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
  const { user, loading, signIn } = useAuth();
  const navigate = useNavigate();
  const search = Route.useSearch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    const { error: err } = await signIn(email, password);
    if (err) {
      setError(err);
      setBusy(false);
    }
    // On success the useEffect above navigates automatically
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
          {String.fromCharCode(169)} {new Date().getFullYear()} ACCM · Active Competency Cluster Model
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

          <h2 className="text-display text-2xl">Welcome back</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Sign in with your ACCM credentials to continue.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-3">
            <Field
              icon={<Mail className="h-4 w-4" />}
              type="email"
              placeholder="you@accm.demo"
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
              {busy ? "Signing in..." : "Sign in"}
              {!busy && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <div className="mt-6 rounded-lg border border-border bg-muted/50 p-3 text-[11px] text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">Demo credentials</p>
            <p>admin@accm.demo · Demo@1234 (all roles)</p>
            <p>pmo@accm.demo · Demo@1234</p>
            <p>manager@accm.demo · Demo@1234</p>
            <p>rm@accm.demo · Demo@1234</p>
            <p>associate@accm.demo · Demo@1234</p>
          </div>
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
}: {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
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
        className="w-full h-10 pl-9 pr-3 rounded-md bg-muted text-sm placeholder:text-muted-foreground border border-transparent focus:outline-none focus:bg-surface-elevated focus:border-border focus:ring-2 focus:ring-ring/20 transition"
      />
    </label>
  );
}
