import { Link, useRouterState } from "@tanstack/react-router";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CocaColaMark, CocaColaBadge } from "@/components/coca-cola-mark";
import { useCopilot } from "@/components/copilot-provider";
import { useState } from "react";

const nav = [
  { to: "/", label: "Overview", icon: LayoutGrid },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/skills", label: "Skills Explorer", icon: Network },
  { to: "/marketplace", label: "Demand Marketplace", icon: Briefcase },
  { to: "/ai-matching", label: "AI Matching", icon: Sparkles },
  { to: "/talent", label: "Talent Workspace", icon: Users },
  { to: "/insights", label: "Workforce Insights", icon: LineChart },
  { to: "/governance", label: "Roles & Governance", icon: KeyRound },
  { to: "/admin", label: "Admin & Governance", icon: ShieldCheck },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Sidebar */}
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
          {nav.map((item) => {
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

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}

function Topbar() {
  const [query, setQuery] = useState("");
  const { openWithPrompt, setOpen } = useCopilot();

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
          onFocus={() => setOpen(true)}
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
        <button
          onClick={() => void openWithPrompt("Create demand; role: Senior ML Engineer; cluster: Data, AI & ML; skills: PyTorch, LLM Eval, Vector DB; loc: Bengaluru - Hybrid; duration: 9 months; priority: Critical")}
          className="h-9 px-3 inline-flex items-center gap-1.5 text-sm font-medium rounded-md bg-gradient-brand text-brand-foreground shadow-sm hover:opacity-95 transition"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          New Demand
        </button>
        <button className="h-9 w-9 grid place-items-center rounded-md hover:bg-muted transition">
          <Bell className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
        </button>
        <div className="ml-1 h-8 w-8 rounded-full bg-gradient-brand grid place-items-center text-[11px] font-semibold text-brand-foreground">
          AR
        </div>
      </div>
    </header>
  );
}
