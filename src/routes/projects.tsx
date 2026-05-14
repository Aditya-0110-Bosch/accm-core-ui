import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageBody, PageHeader } from "@/components/page";
import {
  Plus,
  Filter,
  Building2,
  Users,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  Activity,
  ArrowRight,
  CircleDot,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects Workspace · ACCM" },
      {
        name: "description",
        content:
          "PMO-grade project governance, AI workforce allocation, and live relationship intelligence between people, skills, demands, and projects.",
      },
    ],
  }),
  component: ProjectsWorkspace,
});

type ProjectStatus = "Planning" | "Staffing" | "In Flight" | "At Risk" | "Closing";

type Project = {
  id: string;
  name: string;
  client: string;
  bu: string;
  delivery: string;
  timeline: string;
  status: ProjectStatus;
  fulfillment: number; // 0-100
  capacity: "healthy" | "watch" | "critical";
  openDemands: number;
  assigned: number;
  required: number;
  clusters: string[];
  pm: string;
};

const seedProjects: Project[] = [
  {
    id: "PRJ-2026-00041",
    name: "Atlas — Retail Intelligence Platform",
    client: "Northwind Retail",
    bu: "Retail · BU-04",
    delivery: "Delivery Unit · DU-Bengaluru",
    timeline: "Jan 2026 → Sep 2026",
    status: "Staffing",
    fulfillment: 64,
    capacity: "watch",
    openDemands: 3,
    assigned: 11,
    required: 16,
    clusters: ["Data, AI & ML", "Cloud", "Product"],
    pm: "Aarav R.",
  },
  {
    id: "PRJ-2026-00038",
    name: "Helios — Core Banking Modernization",
    client: "Banco Iberia",
    bu: "BFSI · BU-01",
    delivery: "DU-Madrid",
    timeline: "Mar 2026 → Aug 2027",
    status: "In Flight",
    fulfillment: 92,
    capacity: "healthy",
    openDemands: 1,
    assigned: 38,
    required: 40,
    clusters: ["Engineering", "Cybersecurity", "Strategy"],
    pm: "Maya Chen",
  },
  {
    id: "PRJ-2026-00036",
    name: "Aurora — Generative Knowledge Copilot",
    client: "Internal · Product Org",
    bu: "Platform · BU-09",
    delivery: "DU-Remote",
    timeline: "Feb 2026 → Dec 2026",
    status: "At Risk",
    fulfillment: 41,
    capacity: "critical",
    openDemands: 5,
    assigned: 6,
    required: 14,
    clusters: ["Data, AI & ML", "Design"],
    pm: "Liam P.",
  },
  {
    id: "PRJ-2026-00031",
    name: "Mercator — Supply Network Twin",
    client: "Voss Logistics",
    bu: "Industrials · BU-06",
    delivery: "DU-Hamburg",
    timeline: "Apr 2026 → Mar 2027",
    status: "Planning",
    fulfillment: 18,
    capacity: "watch",
    openDemands: 7,
    assigned: 3,
    required: 22,
    clusters: ["Engineering", "Data", "Consulting"],
    pm: "Sana M.",
  },
];

const statusTone: Record<ProjectStatus, string> = {
  Planning: "bg-muted text-muted-foreground",
  Staffing: "bg-info/10 text-info",
  "In Flight": "bg-success/15 text-success",
  "At Risk": "bg-destructive/10 text-destructive",
  Closing: "bg-warning/15 text-warning",
};

function ProjectsWorkspace() {
  const [filter, setFilter] = useState<"All" | "At Risk" | "Mine" | "Closing">("All");
  const projects = useMemo(() => {
    if (filter === "At Risk") return seedProjects.filter((p) => p.status === "At Risk");
    if (filter === "Closing") return seedProjects.filter((p) => p.status === "Closing");
    return seedProjects;
  }, [filter]);

  return (
    <>
      <PageHeader
        eyebrow="PMO · Projects Workspace"
        title="Projects, governed by intelligence"
        description="Plan, staff, and govern every engagement — with live relationship mapping between people, skills, demand, and delivery."
        actions={
          <>
            <button className="h-9 px-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-elevated text-sm font-medium hover:bg-muted transition">
              <Filter className="h-4 w-4" /> Filter
            </button>
            <button className="h-9 px-3.5 inline-flex items-center gap-1.5 rounded-md bg-gradient-brand text-brand-foreground text-sm font-medium shadow-sm hover:opacity-95 transition">
              <Plus className="h-4 w-4" /> New project
            </button>
          </>
        }
      />

      <PageBody>
        {/* Portfolio KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { l: "Active projects", v: "42", s: "+3 this quarter", icon: Layers, tone: "text-foreground" },
            { l: "Fulfillment rate", v: "78%", s: "Allocation health", icon: TrendingUp, tone: "text-success" },
            { l: "Staffing conflicts", v: "6", s: "AI flagged", icon: AlertTriangle, tone: "text-warning" },
            { l: "Bench at risk", v: "23", s: "≤ 30d coverage", icon: Activity, tone: "text-destructive" },
          ].map((k) => (
            <div key={k.l} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{k.l}</p>
                <k.icon className={cn("h-4 w-4", k.tone)} strokeWidth={1.75} />
              </div>
              <p className="text-display text-3xl mt-2 leading-none">{k.v}</p>
              <p className="text-xs text-muted-foreground mt-1.5">{k.s}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Portfolio</h2>
          <div className="flex gap-1 text-xs">
            {(["All", "At Risk", "Mine", "Closing"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={cn(
                  "px-2.5 py-1 rounded-md transition",
                  filter === t ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Project cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {projects.map((p) => (
            <ProjectCard key={p.id} p={p} />
          ))}
        </div>

        {/* Allocation map + Staffing timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <RelationshipGraph className="lg:col-span-3" />
          <ConstraintsPanel className="lg:col-span-2" />
        </div>

        <StaffingTimeline />
      </PageBody>
    </>
  );
}

function ProjectCard({ p }: { p: Project }) {
  const capacityTone =
    p.capacity === "healthy"
      ? "text-success"
      : p.capacity === "watch"
        ? "text-warning"
        : "text-destructive";
  const capacityDot =
    p.capacity === "healthy"
      ? "bg-success"
      : p.capacity === "watch"
        ? "bg-warning"
        : "bg-destructive";

  return (
    <div className="group rounded-xl border border-border bg-card p-5 hover:border-ring/40 hover:shadow-elevated transition">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-mono text-muted-foreground">{p.id}</span>
            <span className={cn("text-[11px] px-1.5 py-0.5 rounded font-medium", statusTone[p.status])}>
              {p.status}
            </span>
          </div>
          <h3 className="text-[15px] font-semibold mt-1.5 truncate">{p.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5 inline-flex items-center gap-1.5">
            <Building2 className="h-3 w-3" /> {p.client} · {p.bu}
          </p>
        </div>
        <div className={cn("inline-flex items-center gap-1 text-[11px] font-medium", capacityTone)}>
          <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse-soft", capacityDot)} />
          {p.capacity === "healthy" ? "Healthy" : p.capacity === "watch" ? "Watch" : "Critical"}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {p.clusters.map((c) => (
          <span key={c} className="text-[11px] px-2 py-0.5 rounded bg-muted text-muted-foreground">
            {c}
          </span>
        ))}
      </div>

      {/* Fulfillment bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Staffing fulfillment</span>
          <span className="font-medium">
            {p.assigned}/{p.required} · {p.fulfillment}%
          </span>
        </div>
        <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-brand"
            style={{ width: `${p.fulfillment}%` }}
          />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <Users className="h-3 w-3" /> PM · {p.pm}
          </span>
          <span className="inline-flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-brand" /> {p.openDemands} open
          </span>
        </div>
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-1 font-medium text-foreground opacity-0 group-hover:opacity-100 transition"
        >
          View demand <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

/* ---------- Relationship Graph (People · Skills · Projects · Demand) ---------- */

function RelationshipGraph({ className }: { className?: string }) {
  // Simple SVG graph showing cardinality between entities.
  return (
    <div className={cn("rounded-xl border border-border bg-card p-5 bg-gradient-aurora", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-brand font-medium">
            Relationship Intelligence
          </p>
          <h3 className="text-display text-2xl mt-1">Talent ↔ Skills ↔ Projects</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-md">
            Live cardinality map. Hover any node to trace allocation paths and constraint impact.
          </p>
        </div>
        <button className="h-8 px-2.5 text-xs rounded-md border border-border bg-surface-elevated/80 backdrop-blur inline-flex items-center gap-1.5 hover:bg-muted">
          <Sparkles className="h-3 w-3 text-brand" /> Ask graph
        </button>
      </div>

      <div className="mt-5 rounded-lg border border-border bg-surface-elevated/70 backdrop-blur-sm p-4">
        <svg viewBox="0 0 600 280" className="w-full h-[280px]">
          <defs>
            <linearGradient id="edge" x1="0" x2="1">
              <stop offset="0" stopColor="oklch(0.55 0.21 280)" stopOpacity="0.5" />
              <stop offset="1" stopColor="oklch(0.65 0.18 240)" stopOpacity="0.2" />
            </linearGradient>
            <radialGradient id="nodebrand" cx="0.5" cy="0.4">
              <stop offset="0" stopColor="oklch(0.7 0.18 290)" />
              <stop offset="1" stopColor="oklch(0.55 0.21 280)" />
            </radialGradient>
          </defs>

          {/* Edges */}
          {[
            // people → skills
            ["P1", 80, 60, "S1", 250, 50],
            ["P1", 80, 60, "S2", 250, 110],
            ["P2", 80, 140, "S2", 250, 110],
            ["P2", 80, 140, "S3", 250, 170],
            ["P3", 80, 220, "S3", 250, 170],
            ["P3", 80, 220, "S4", 250, 230],
            // skills → projects
            ["S1", 250, 50, "PR1", 440, 80],
            ["S2", 250, 110, "PR1", 440, 80],
            ["S2", 250, 110, "PR2", 440, 170],
            ["S3", 250, 170, "PR2", 440, 170],
            ["S4", 250, 230, "PR3", 440, 230],
            // projects → demand
            ["PR1", 440, 80, "D1", 560, 100],
            ["PR2", 440, 170, "D2", 560, 180],
          ].map((e, i) => {
            const [, x1, y1, , x2, y2] = e as [string, number, number, string, number, number];
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="url(#edge)"
                strokeWidth="1.25"
              />
            );
          })}

          {/* Column labels */}
          <text x="80" y="20" textAnchor="middle" fontSize="10" fill="oklch(0.5 0.02 270)" fontFamily="Inter">
            PEOPLE
          </text>
          <text x="250" y="20" textAnchor="middle" fontSize="10" fill="oklch(0.5 0.02 270)" fontFamily="Inter">
            SKILLS
          </text>
          <text x="440" y="20" textAnchor="middle" fontSize="10" fill="oklch(0.5 0.02 270)" fontFamily="Inter">
            PROJECTS
          </text>
          <text x="560" y="20" textAnchor="middle" fontSize="10" fill="oklch(0.5 0.02 270)" fontFamily="Inter">
            DEMAND
          </text>

          {/* People */}
          {[
            { x: 80, y: 60, l: "Maya C." },
            { x: 80, y: 140, l: "Aarav R." },
            { x: 80, y: 220, l: "Liam P." },
          ].map((n) => (
            <g key={n.l}>
              <circle cx={n.x} cy={n.y} r="14" fill="url(#nodebrand)" />
              <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="9" fill="white" fontFamily="Inter" fontWeight="600">
                {n.l.split(" ")[0][0]}
                {n.l.split(" ")[1][0]}
              </text>
              <text x={n.x + 22} y={n.y + 4} fontSize="11" fill="oklch(0.18 0.02 270)" fontFamily="Inter">
                {n.l}
              </text>
            </g>
          ))}

          {/* Skills */}
          {[
            { x: 250, y: 50, l: "PyTorch" },
            { x: 250, y: 110, l: "LLM Eval" },
            { x: 250, y: 170, l: "AWS / EKS" },
            { x: 250, y: 230, l: "Design Systems" },
          ].map((n) => (
            <g key={n.l}>
              <rect
                x={n.x - 38}
                y={n.y - 11}
                width="76"
                height="22"
                rx="6"
                fill="oklch(1 0 0)"
                stroke="oklch(0.93 0.008 270)"
              />
              <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="10" fill="oklch(0.18 0.02 270)" fontFamily="Inter">
                {n.l}
              </text>
            </g>
          ))}

          {/* Projects */}
          {[
            { x: 440, y: 80, l: "Atlas" },
            { x: 440, y: 170, l: "Helios" },
            { x: 440, y: 230, l: "Aurora" },
          ].map((n) => (
            <g key={n.l}>
              <rect
                x={n.x - 30}
                y={n.y - 12}
                width="60"
                height="24"
                rx="6"
                fill="oklch(0.96 0.015 280)"
                stroke="oklch(0.55 0.21 280 / 0.25)"
              />
              <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="10" fill="oklch(0.35 0.15 280)" fontFamily="Inter" fontWeight="600">
                {n.l}
              </text>
            </g>
          ))}

          {/* Demands */}
          {[
            { x: 560, y: 100, l: "DM-145" },
            { x: 560, y: 180, l: "DM-142" },
          ].map((n) => (
            <g key={n.l}>
              <circle cx={n.x} cy={n.y} r="10" fill="oklch(0.99 0.003 270)" stroke="oklch(0.55 0.21 280)" strokeWidth="1.25" />
              <text x={n.x} y={n.y + 22} textAnchor="middle" fontSize="9" fontFamily="Inter" fill="oklch(0.5 0.02 270)">
                {n.l}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
        {[
          { l: "Avg skills / person", v: "7.4" },
          { l: "Avg projects / person", v: "1.8" },
          { l: "Skill reuse index", v: "0.62" },
        ].map((s) => (
          <div key={s.l} className="rounded-md border border-border bg-surface-elevated/80 p-2.5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</p>
            <p className="text-base font-semibold mt-0.5">{s.v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Constraints + AI staffing panel ---------- */

function ConstraintsPanel({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-5", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Constraints & AI guidance</h3>
        <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
          <CircleDot className="h-3 w-3 text-brand animate-pulse-soft" /> Live
        </span>
      </div>

      <div className="mt-4 space-y-3">
        <Alert
          tone="warning"
          title="Allocation conflict · Maya Chen"
          body="Currently 110% allocated across Atlas + Helios. Suggested action: shift 20% to Liam P. (87% match)."
        />
        <Alert
          tone="destructive"
          title="Geography restriction · Aurora demand"
          body="Selected candidate is outside EU data-residency policy for client. Filter applied automatically."
        />
        <Alert
          tone="info"
          title="Bench-first recommendation"
          body="3 bench engineers exceed 92% match for DM-2026-000139. Routing to Resource Manager queue."
        />
      </div>

      <div className="mt-5 rounded-lg border border-border bg-surface p-3">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Active rules</p>
        <ul className="mt-2 space-y-1.5 text-xs">
          {[
            "Max allocation 100% per employee",
            "Skill proficiency ≥ L3 for critical demand",
            "Bench-first routing for ≤ 30d coverage",
            "Mandatory cert: SC-200 for Cybersecurity cluster",
          ].map((r) => (
            <li key={r} className="flex items-center gap-2">
              <ShieldCheck className="h-3 w-3 text-brand" />
              <span className="text-foreground/80">{r}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Alert({
  tone,
  title,
  body,
}: {
  tone: "warning" | "destructive" | "info";
  title: string;
  body: string;
}) {
  const map = {
    warning: { dot: "bg-warning", text: "text-warning", bg: "bg-warning/5", border: "border-warning/30" },
    destructive: {
      dot: "bg-destructive",
      text: "text-destructive",
      bg: "bg-destructive/5",
      border: "border-destructive/30",
    },
    info: { dot: "bg-info", text: "text-info", bg: "bg-info/5", border: "border-info/30" },
  }[tone];
  return (
    <div className={cn("rounded-lg border p-3", map.bg, map.border)}>
      <div className="flex items-start gap-2.5">
        <span className={cn("mt-1.5 h-1.5 w-1.5 rounded-full shrink-0", map.dot)} />
        <div className="min-w-0">
          <p className={cn("text-xs font-semibold", map.text)}>{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{body}</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Staffing timeline ---------- */

function StaffingTimeline() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
  const rows = [
    { name: "Maya Chen", role: "ML Lead", bars: [{ s: 0, e: 8, p: "Helios", tone: "bg-gradient-brand" }, { s: 5, e: 9, p: "Atlas", tone: "bg-info/70" }] },
    { name: "Aarav R.", role: "Cloud Arch", bars: [{ s: 0, e: 6, p: "Atlas", tone: "bg-info/70" }, { s: 7, e: 9, p: "Mercator", tone: "bg-success/70" }] },
    { name: "Liam P.", role: "Designer", bars: [{ s: 1, e: 5, p: "Aurora", tone: "bg-warning/70" }] },
    { name: "Sana M.", role: "Delivery", bars: [{ s: 2, e: 9, p: "Mercator", tone: "bg-success/70" }] },
    { name: "Noor K.", role: "Engineer", bars: [{ s: 0, e: 4, p: "Helios", tone: "bg-gradient-brand" }, { s: 6, e: 9, p: "Aurora", tone: "bg-warning/70" }] },
  ];
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold">Staffing horizon · next 9 months</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Modern allocation map — no Gantts. Hover a band for utilization detail.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          {[
            { l: "Helios", c: "bg-gradient-brand" },
            { l: "Atlas", c: "bg-info/70" },
            { l: "Aurora", c: "bg-warning/70" },
            { l: "Mercator", c: "bg-success/70" },
          ].map((k) => (
            <span key={k.l} className="inline-flex items-center gap-1.5">
              <span className={cn("h-2 w-3 rounded-sm", k.c)} />
              {k.l}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[160px_1fr] gap-x-3 text-xs">
        <div />
        <div className="grid grid-cols-9 text-[10px] uppercase tracking-wider text-muted-foreground pb-2 border-b border-border">
          {months.map((m) => (
            <div key={m} className="text-center">
              {m}
            </div>
          ))}
        </div>
        {rows.map((r) => (
          <div key={r.name} className="contents">
            <div className="py-3 border-b border-border">
              <p className="text-sm font-medium leading-tight">{r.name}</p>
              <p className="text-[11px] text-muted-foreground">{r.role}</p>
            </div>
            <div className="relative grid grid-cols-9 py-3 border-b border-border">
              {months.map((_, i) => (
                <div key={i} className="border-l border-dashed border-border/60 first:border-l-0 h-6" />
              ))}
              {r.bars.map((b, i) => (
                <div
                  key={i}
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 h-5 rounded-md text-[10px] font-medium text-white/95 px-2 inline-flex items-center shadow-sm",
                    b.tone
                  )}
                  style={{
                    left: `${(b.s / 9) * 100}%`,
                    width: `${((b.e - b.s) / 9) * 100}%`,
                  }}
                >
                  {b.p}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
