import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutGrid,
  Network,
  Sparkles,
  Users,
  LineChart,
  ShieldCheck,
  Briefcase,
  FolderKanban,
  KeyRound,
  Search,
  Bell,
  Plus,
  LogOut,
  Upload,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { CocaColaMark, CocaColaBadge } from "@/components/coca-cola-mark";
import { useCopilot } from "@/components/copilot-provider";
import { useAuth, type AppRole } from "@/hooks/use-auth";
import { api } from "@/lib/api";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutGrid;
  roles: AppRole[]; // any of these grants visibility
};

const ALL: AppRole[] = ["admin", "pmo", "manager", "rm", "associate"];

const nav: NavItem[] = [
  { to: "/", label: "Overview", icon: LayoutGrid, roles: ALL },
  { to: "/projects", label: "Projects", icon: FolderKanban, roles: ["admin", "pmo", "manager", "rm"] },
  { to: "/skills", label: "Skills Explorer", icon: Network, roles: ALL },
  { to: "/marketplace", label: "Demand Marketplace", icon: Briefcase, roles: ALL },
  { to: "/ai-matching", label: "AI Matching", icon: Sparkles, roles: ["admin", "pmo", "manager", "rm"] },
  { to: "/talent", label: "Talent Workspace", icon: Users, roles: ["admin", "pmo", "manager", "rm", "associate"] },
  { to: "/insights", label: "Workforce Insights", icon: LineChart, roles: ["admin", "pmo", "manager", "rm"] },
  { to: "/governance", label: "Roles & Governance", icon: KeyRound, roles: ["admin", "pmo"] },
  { to: "/admin", label: "Admin & Governance", icon: ShieldCheck, roles: ["admin"] },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { hasAnyRole, roles } = useAuth();

  const visible = nav.filter((n) => hasAnyRole(n.roles));

  return (
    <div className="min-h-screen flex w-full bg-background">
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-sidebar">
        <div className="px-5 py-5 flex items-center gap-2.5">
          <div className="relative h-9 w-9 rounded-lg bg-gradient-brand grid place-items-center shadow-glow">
            <span className="font-script text-base text-white leading-none">C</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight">ACCM</span>
            <span className="text-[11px] text-muted-foreground">
              for <CocaColaMark className="text-[13px]" />
            </span>
          </div>
        </div>

        <nav className="px-3 py-2 flex-1 space-y-0.5">
          <p className="px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Workspace
          </p>
          {visible.map((item) => {
            const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                <span>{item.label}</span>
              </Link>
            );
          })}
          {roles.length === 0 && (
            <p className="px-3 py-2 text-[11px] text-muted-foreground italic">
              No roles assigned. Contact an admin.
            </p>
          )}
        </nav>

        <div className="m-3 rounded-lg border border-sidebar-border bg-gradient-to-br from-brand/8 to-transparent p-3">
          <CocaColaBadge />
          <div className="mt-2 flex items-center gap-2 text-xs font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-soft" />
            Sync · Skills Master
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            12,480 skills · last refresh 2m ago
          </p>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}

const ROLE_LABEL: Record<AppRole, string> = {
  admin: "Admin",
  pmo: "PMO",
  manager: "Manager",
  rm: "Resource Mgr",
  associate: "Associate",
};

function Topbar() {
  const [query, setQuery] = useState("");
  const { openWithPrompt, setOpen: setCopilotOpen } = useCopilot();
  const { user, roles, signOut, hasAnyRole } = useAuth();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const initials = user?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? user?.email?.[0]?.toUpperCase();

  const primaryRole = roles[0] ? ROLE_LABEL[roles[0]] : "No role";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-border bg-background/80 backdrop-blur-md flex items-center gap-3 px-6">
      <div className="hidden lg:flex items-center gap-2 pr-3 mr-1 border-r border-border h-8">
        <CocaColaMark className="text-lg" />
      </div>
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setCopilotOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && query.trim()) {
              e.preventDefault();
              void openWithPrompt(query);
              setQuery("");
            }
          }}
          placeholder="Ask anything · find skills, people, demands…"
          className="w-full h-9 pl-9 pr-16 rounded-md bg-muted text-sm placeholder:text-muted-foreground border border-transparent focus:outline-none focus:bg-surface-elevated focus:border-border focus:ring-2 focus:ring-ring/20 transition"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-muted-foreground border border-border rounded px-1.5 py-0.5 bg-background">
          ⌘K
        </kbd>
      </div>
      <div className="flex items-center gap-1.5">
        {hasAnyRole(["admin", "pmo"]) && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploading(true);
                try {
                  const result = await api.uploadTalentCSV(file);
                  alert(result.message);
                } catch (err: any) {
                  alert(`Upload failed: ${err.message}`);
                } finally {
                  setUploading(false);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="h-9 px-3 inline-flex items-center gap-1.5 text-sm font-medium rounded-md border border-border bg-surface-elevated hover:bg-muted transition disabled:opacity-50"
            >
              <Upload className="h-4 w-4" strokeWidth={2} />
              {uploading ? "Uploading..." : "Upload Skill Matrix"}
            </button>
          </>
        )}
        {hasAnyRole(["admin", "pmo", "manager"]) && (
          <button
            onClick={() => void openWithPrompt("Create demand; role: Senior ML Engineer; cluster: Data, AI & ML; skills: PyTorch, LLM Eval, Vector DB; loc: Bengaluru - Hybrid; duration: 9 months; priority: Critical; capacity: 1.0")}
            className="h-9 px-3 inline-flex items-center gap-1.5 text-sm font-medium rounded-md bg-gradient-brand text-brand-foreground shadow-sm hover:opacity-95 transition"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            New Demand
          </button>
        )}
        <button className="h-9 w-9 grid place-items-center rounded-md hover:bg-muted transition">
          <Bell className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
        </button>
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="ml-1 h-8 w-8 rounded-full bg-gradient-brand grid place-items-center text-[11px] font-semibold text-brand-foreground hover:opacity-90 transition"
          >
            {initials || "?"}
          </button>
          {open && (
            <div className="absolute right-0 top-10 w-60 rounded-lg border border-border bg-popover shadow-elevated p-1.5 text-sm">
              <div className="px-3 py-2 border-b border-border">
                <p className="font-medium truncate">{user?.fullName || user?.email}</p>
                <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {roles.length > 0 ? (
                    roles.map((r) => (
                      <span key={r} className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand/10 text-brand font-semibold">
                        {ROLE_LABEL[r]}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-muted-foreground">{primaryRole}</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  signOut();
                  navigate({ to: "/login", search: { redirect: "/" } });
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition text-left"
              >
                <LogOut className="h-4 w-4 text-muted-foreground" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
