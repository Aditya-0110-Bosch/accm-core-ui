import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageBody, PageHeader } from "@/components/page";
import { ChevronRight, ChevronDown, Sparkles, Users, GitBranch, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

export const Route = createFileRoute("/_authenticated/skills")({
  head: () => ({
    meta: [
      { title: "Skills Explorer · ACCM" },
      { name: "description", content: "Catalogue, matrix, and master — your living competency graph." },
    ],
  }),
  component: SkillsExplorer,
});

const fallbackTree = [
  {
    name: "Engineering & Cloud",
    count: 412,
    children: [
      {
        name: "Cloud Architecture",
        count: 86,
        children: [
          { name: "AWS Solutions Design", count: 32 },
          { name: "Azure Landing Zones", count: 24 },
          { name: "GCP Anthos", count: 18 },
        ],
      },
      { name: "Backend Engineering", count: 142 },
      { name: "Site Reliability", count: 64 },
    ],
  },
  {
    name: "Data, AI & ML",
    count: 318,
    children: [
      { name: "Applied ML", count: 88 },
      { name: "LLM Engineering", count: 54 },
      { name: "Data Platforms", count: 96 },
    ],
  },
  { name: "Product & Design", count: 187 },
  { name: "Strategy & Consulting", count: 134 },
];

function SkillsExplorer() {
  const skillsQuery = useQuery({ queryKey: ["skills"], queryFn: api.getSkills });
  const tree = skillsQuery.data?.tree || fallbackTree;
  const primarySkills = skillsQuery.data?.primarySkills || [
    { n: "AWS Solutions Design", lvl: "Expert", talents: 32 },
    { n: "Azure Landing Zones", lvl: "Advanced", talents: 24 },
    { n: "Kubernetes Platform", lvl: "Expert", talents: 41 },
    { n: "Terraform & IaC", lvl: "Advanced", talents: 56 },
    { n: "Service Mesh (Istio)", lvl: "Intermediate", talents: 12 },
    { n: "FinOps for Cloud", lvl: "Emerging", talents: 8 },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Skills Intelligence"
        title="Skills Explorer"
        description="A living, governed taxonomy of every skill, cluster, and competency in your organization."
        actions={
          <button className="h-9 px-3.5 inline-flex items-center gap-1.5 rounded-md bg-foreground text-background text-sm font-medium">
            <Plus className="h-4 w-4" /> New Skill
          </button>
        }
      />

      <div className="grid grid-cols-12 gap-0 min-h-[calc(100vh-14rem)]">
        {/* Tree */}
        <aside className="col-span-12 lg:col-span-3 border-r border-border p-5 bg-surface">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-3">
            Taxonomy
          </div>
          <Tree nodes={tree} />
        </aside>

        {/* Main */}
        <div className="col-span-12 lg:col-span-6 p-8 space-y-6">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-[11px] text-brand font-medium uppercase tracking-wider">Cluster</p>
              <h2 className="text-display text-3xl mt-1">Cloud Architecture</h2>
              <p className="text-sm text-muted-foreground mt-1">86 skills · 412 talents · governed by Platform Eng.</p>
            </div>
            <div className="flex gap-2 text-xs">
              <Badge tone="brand">Critical</Badge>
              <Badge>v 4.2</Badge>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Primary skills</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {primarySkills.map((s) => (
                <div key={s.n} className="rounded-lg border border-border bg-card p-4 hover:border-ring/40 transition">
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-medium">{s.n}</p>
                    <Badge tone="muted">{s.lvl}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                    <Users className="h-3 w-3" /> {s.talents} talents
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Adjacent clusters</h3>
            <div className="flex flex-wrap gap-2">
              {["Site Reliability", "Platform Engineering", "Security Architecture", "Data Platforms", "DevSecOps"].map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border border-border bg-card hover:border-ring/40 transition"
                >
                  <GitBranch className="h-3 w-3 text-brand" /> {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Insights */}
        <aside className="col-span-12 lg:col-span-3 border-l border-border p-5 bg-surface space-y-5">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-brand font-medium">
              <Sparkles className="h-3 w-3" /> AI Insight
            </div>
            <p className="mt-2 text-sm leading-relaxed">
              {skillsQuery.data?.insight || "Demand for Kubernetes Platform is growing 38% quarter-over-quarter. Consider seeding 12 internal candidates from SRE."}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">Governance</p>
            <ul className="text-sm space-y-2">
              <li className="flex justify-between"><span className="text-muted-foreground">Owner</span><span>Platform Eng</span></li>
              <li className="flex justify-between"><span className="text-muted-foreground">Last reviewed</span><span>3 days ago</span></li>
              <li className="flex justify-between"><span className="text-muted-foreground">Pending approvals</span><span>2</span></li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">Skill criticality</p>
            <div className="space-y-2">
              {[
                ["Strategic", 78],
                ["Scarce", 64],
                ["Volatility", 42],
              ].map(([l, v]) => (
                <div key={l as string}>
                  <div className="flex justify-between text-xs">
                    <span>{l}</span>
                    <span className="text-muted-foreground">{v}</span>
                  </div>
                  <div className="h-1.5 mt-1 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gradient-brand" style={{ width: `${v}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

type Node = { name: string; count: number; children?: Node[] };

function Tree({ nodes, depth = 0 }: { nodes: Node[]; depth?: number }) {
  return (
    <ul className="space-y-0.5">
      {nodes.map((n) => (
        <TreeItem key={n.name} node={n} depth={depth} />
      ))}
    </ul>
  );
}

function TreeItem({ node, depth }: { node: Node; depth: number }) {
  const [open, setOpen] = useState(depth < 1);
  const hasKids = !!node.children?.length;
  return (
    <li>
      <button
        onClick={() => hasKids && setOpen((v) => !v)}
        className={cn(
          "w-full flex items-center gap-1 py-1.5 px-2 rounded-md text-sm hover:bg-muted transition text-left",
          depth === 0 && "font-medium"
        )}
        style={{ paddingLeft: depth * 12 + 8 }}
      >
        {hasKids ? (
          open ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> :
                 <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        ) : <span className="w-3.5 shrink-0" />}
        <span className="flex-1 truncate">{node.name}</span>
        <span className="text-[11px] text-muted-foreground tabular-nums">{node.count}</span>
      </button>
      {hasKids && open && <Tree nodes={node.children!} depth={depth + 1} />}
    </li>
  );
}

function Badge({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "brand" | "muted" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-[11px] px-2 py-0.5 rounded-md font-medium border",
        tone === "brand" && "bg-accent text-accent-foreground border-transparent",
        tone === "muted" && "bg-muted text-muted-foreground border-transparent",
        tone === "default" && "bg-card text-foreground border-border"
      )}
    >
      {children}
    </span>
  );
}
