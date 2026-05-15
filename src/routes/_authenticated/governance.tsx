import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageBody, PageHeader } from "@/components/page";
import {
  ShieldCheck,
  Crown,
  Briefcase,
  Users,
  UserCheck,
  Sparkles,
  Plus,
  Check,
  Minus,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/governance")({
  head: () => ({
    meta: [
      { title: "Roles & Governance · ACCM" },
      {
        name: "description",
        content:
          "Role-based access control, permission matrix, and approval workflows for projects, demand, and allocations.",
      },
    ],
  }),
  component: Governance,
});

type Role = {
  id: string;
  name: string;
  icon: typeof ShieldCheck;
  members: number;
  scope: string;
  highlight?: boolean;
};

const roles: Role[] = [
  { id: "admin", name: "Admin", icon: ShieldCheck, members: 6, scope: "Platform-wide governance" },
  { id: "pmo", name: "PMO Office", icon: Briefcase, members: 14, scope: "Projects, demand, governance", highlight: true },
  { id: "pm", name: "Project Manager", icon: UserCheck, members: 84, scope: "Owned projects + demand" },
  { id: "delivery", name: "Delivery Manager", icon: Sparkles, members: 31, scope: "Delivery unit visibility" },
  { id: "rm", name: "Resource Manager", icon: Users, members: 22, scope: "Allocations & approvals" },
  { id: "talent", name: "Talent / Employee", icon: Users, members: 4820, scope: "Self · eligible demand" },
  { id: "exec", name: "Leadership", icon: Crown, members: 9, scope: "Org-wide capability insights" },
];

const capabilities = [
  "Projects",
  "Demands",
  "Talent pools",
  "Skills",
  "Allocations",
  "Approvals",
  "Reports",
] as const;

type Cap = (typeof capabilities)[number];
type Level = "full" | "scoped" | "read" | "none";

const matrix: Record<string, Record<Cap, Level>> = {
  admin: { Projects: "full", Demands: "full", "Talent pools": "full", Skills: "full", Allocations: "full", Approvals: "full", Reports: "full" },
  pmo: { Projects: "full", Demands: "full", "Talent pools": "read", Skills: "scoped", Allocations: "scoped", Approvals: "full", Reports: "full" },
  pm: { Projects: "scoped", Demands: "scoped", "Talent pools": "read", Skills: "read", Allocations: "read", Approvals: "scoped", Reports: "scoped" },
  delivery: { Projects: "scoped", Demands: "read", "Talent pools": "scoped", Skills: "read", Allocations: "scoped", Approvals: "scoped", Reports: "scoped" },
  rm: { Projects: "read", Demands: "read", "Talent pools": "full", Skills: "read", Allocations: "full", Approvals: "scoped", Reports: "scoped" },
  talent: { Projects: "none", Demands: "scoped", "Talent pools": "none", Skills: "scoped", Allocations: "read", Approvals: "none", Reports: "none" },
  exec: { Projects: "read", Demands: "read", "Talent pools": "read", Skills: "read", Allocations: "read", Approvals: "none", Reports: "full" },
};

function Governance() {
  const [active, setActive] = useState<string>("pmo");
  const r = roles.find((x) => x.id === active)!;

  return (
    <>
      <PageHeader
        eyebrow="Identity · RBAC"
        title="Roles & Governance"
        description="Enterprise-grade access control across projects, demand, and allocations — designed as workflows, not admin tables."
        actions={
          <button className="h-9 px-3.5 inline-flex items-center gap-1.5 rounded-md bg-gradient-brand text-brand-foreground text-sm font-medium shadow-sm hover:opacity-95 transition">
            <Plus className="h-4 w-4" /> New role
          </button>
        }
      />

      <PageBody>
        {/* Role rail + detail */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Roles list */}
          <div className="rounded-xl border border-border bg-card p-2 h-fit">
            <p className="px-3 py-2 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
              Roles
            </p>
            <div className="space-y-0.5">
              {roles.map((role) => {
                const Icon = role.icon;
                const isActive = role.id === active;
                return (
                  <button
                    key={role.id}
                    onClick={() => setActive(role.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition text-left",
                      isActive ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                    )}
                  >
                    <div className={cn("h-8 w-8 rounded-md grid place-items-center shrink-0", isActive ? "bg-gradient-brand" : "bg-muted")}>
                      <Icon className={cn("h-4 w-4", isActive ? "text-brand-foreground" : "text-muted-foreground")} strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{role.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{role.members} members</p>
                    </div>
                    {role.highlight && (
                      <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-semibold bg-gradient-brand text-brand-foreground">
                        Owner
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detail */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 bg-gradient-aurora">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-wider font-medium text-brand">{r.name}</p>
                  <h3 className="text-display text-2xl mt-1">{r.scope}</h3>
                  <p className="text-sm text-muted-foreground mt-1.5 max-w-xl">
                    {r.id === "pmo" && "Owns project creation, governance, and allocation oversight across the portfolio."}
                    {r.id === "pm" && "Creates demand requests for owned projects, shortlists candidates, drives delivery."}
                    {r.id === "talent" && "Discovers eligible demand, applies to opportunities, tracks growth pathways."}
                    {r.id === "rm" && "Approves allocations, balances utilization, manages bench-first staffing."}
                    {r.id === "delivery" && "Oversees delivery unit health, capacity, and project handoffs."}
                    {r.id === "admin" && "Platform stewardship: identity, security, governance configuration."}
                    {r.id === "exec" && "Strategic capability insights — capacity, gaps, and workforce risk."}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="h-9 px-3 rounded-md border border-border bg-surface-elevated/80 backdrop-blur text-sm font-medium hover:bg-muted transition">
                    Manage members
                  </button>
                </div>
              </div>
            </div>

            {/* Permission matrix */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold">Permission matrix</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Capabilities granted to {r.name}. Full · Scoped · Read · None.
                  </p>
                </div>
                <Legend />
              </div>
              <div className="grid grid-cols-7 px-5 py-2.5 text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border bg-surface">
                {capabilities.map((c) => (
                  <div key={c} className="text-center">
                    {c}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 px-5 py-5">
                {capabilities.map((c) => (
                  <LevelCell key={c} level={matrix[r.id][c]} />
                ))}
              </div>
            </div>

            {/* Approval workflows */}
            <ApprovalWorkflows />
          </div>
        </div>
      </PageBody>
    </>
  );
}

function Legend() {
  const items: { l: string; tone: string }[] = [
    { l: "Full", tone: "bg-gradient-brand" },
    { l: "Scoped", tone: "bg-info/70" },
    { l: "Read", tone: "bg-muted-foreground/40" },
    { l: "None", tone: "bg-muted" },
  ];
  return (
    <div className="hidden md:flex items-center gap-3 text-[11px] text-muted-foreground">
      {items.map((i) => (
        <span key={i.l} className="inline-flex items-center gap-1.5">
          <span className={cn("h-2 w-3 rounded-sm", i.tone)} />
          {i.l}
        </span>
      ))}
    </div>
  );
}

function LevelCell({ level }: { level: Level }) {
  const tone =
    level === "full"
      ? "bg-gradient-brand text-brand-foreground"
      : level === "scoped"
        ? "bg-info/15 text-info"
        : level === "read"
          ? "bg-muted text-muted-foreground"
          : "bg-transparent text-muted-foreground/50";
  const label = level === "full" ? "Full" : level === "scoped" ? "Scoped" : level === "read" ? "Read" : "—";
  const Icon = level === "none" ? Minus : Check;
  return (
    <div className="flex justify-center">
      <span className={cn("inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-md", tone)}>
        <Icon className="h-3 w-3" /> {label}
      </span>
    </div>
  );
}

function ApprovalWorkflows() {
  const flows = [
    {
      title: "Demand approval",
      stages: ["PM submits", "PMO review", "Resource Mgr", "Published"],
      meta: "Auto-route via business rules",
    },
    {
      title: "Allocation approval",
      stages: ["Match generated", "RM review", "Delivery Mgr sign-off", "Allocated"],
      meta: "Triggers utilization recalculation",
    },
    {
      title: "Project creation",
      stages: ["PMO drafts", "BU Head approval", "Charter signed", "Active"],
      meta: "Required for any new engagement",
    },
  ];
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold">Approval workflows</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Routing logic governed by role + business rules engine.
          </p>
        </div>
      </div>
      <div className="space-y-3">
        {flows.map((f) => (
          <div key={f.title} className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold">{f.title}</p>
              <span className="text-[11px] text-muted-foreground">{f.meta}</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {f.stages.map((s, i) => (
                <span key={s} className="inline-flex items-center gap-1.5">
                  <span
                    className={cn(
                      "text-[11px] px-2 py-1 rounded-md font-medium",
                      i === 0
                        ? "bg-gradient-brand text-brand-foreground"
                        : i === f.stages.length - 1
                          ? "bg-success/15 text-success"
                          : "bg-muted text-foreground/80"
                    )}
                  >
                    {s}
                  </span>
                  {i < f.stages.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
