import { createFileRoute } from "@tanstack/react-router";
import { PageBody, PageHeader } from "@/components/page";
import { Sparkles, Brain, Network, TrendingUp, Shield, GitMerge, Layers, Activity, Zap } from "lucide-react";

export const Route = createFileRoute("/_authenticated/ai-matching")({
  head: () => ({
    meta: [
      { title: "AI Matching · ACCM" },
      { name: "description", content: "Orchestration engine for matching, forecasting, and workforce intelligence." },
    ],
  }),
  component: AIMatching,
});

const engines = [
  { icon: GitMerge, name: "Matching Engine", desc: "Skill + context + intent ranking", status: "live", calls: "1.2M / day" },
  { icon: Brain, name: "Skill Extraction", desc: "From CVs, JDs, projects, signals", status: "live", calls: "84K / day" },
  { icon: Network, name: "Competency Graph", desc: "Adjacency + relationship inference", status: "live", calls: "Continuous" },
  { icon: TrendingUp, name: "Workforce Forecast", desc: "Demand-supply 4-quarter outlook", status: "live", calls: "Hourly" },
  { icon: Layers, name: "Pyramid Mix", desc: "Junior / mid / senior balance", status: "beta", calls: "Daily" },
  { icon: Shield, name: "Risk & Resilience", desc: "Concentration, attrition, scarcity", status: "live", calls: "Hourly" },
];

const candidates = [
  { name: "Maya Chen", role: "Senior ML Engineer", match: 94, gaps: 1, badges: ["LLM Eval", "PyTorch"] },
  { name: "Rohan Patel", role: "ML Engineer II", match: 89, gaps: 2, badges: ["PyTorch", "Vector DB"] },
  { name: "Lin Wang", role: "Applied Scientist", match: 86, gaps: 2, badges: ["RAG", "Eval"] },
  { name: "Sara Okafor", role: "Data Scientist", match: 81, gaps: 3, badges: ["Python", "MLOps"] },
];

function AIMatching() {
  return (
    <>
      <PageHeader
        eyebrow="AI & Processing Layer"
        title="Matching Center"
        description="A composable orchestration of intelligence engines — running continuously across your workforce."
      />

      <PageBody>
        {/* Orchestration */}
        <div className="relative rounded-2xl border border-border bg-card overflow-hidden">
          <div className="absolute inset-0 bg-gradient-mesh opacity-70 pointer-events-none" />
          <div className="relative p-8">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand" />
              <span className="text-[11px] uppercase tracking-wider font-medium text-brand">Live orchestration</span>
            </div>
            <h2 className="text-display text-3xl mt-2">9 engines · one signal layer</h2>

            <div className="mt-8 grid grid-cols-3 md:grid-cols-9 items-center gap-3">
              {/* Inputs */}
              <Node icon={Layers} label="Profiles" />
              <Node icon={Layers} label="Demands" />
              <Node icon={Layers} label="Signals" />
              {/* Center */}
              <div className="col-span-3 flex items-center justify-center">
                <div className="relative h-28 w-28">
                  <div className="absolute inset-0 rounded-full bg-gradient-brand opacity-20 animate-pulse-soft" />
                  <div className="absolute inset-3 rounded-full bg-gradient-brand grid place-items-center shadow-glow animate-float-slow">
                    <Brain className="h-8 w-8 text-brand-foreground" strokeWidth={1.5} />
                  </div>
                </div>
              </div>
              {/* Outputs */}
              <Node icon={Zap} label="Matches" tone="brand" />
              <Node icon={TrendingUp} label="Forecasts" tone="brand" />
              <Node icon={Shield} label="Risk" tone="brand" />
            </div>
          </div>
        </div>

        {/* Engines grid */}
        <div>
          <h3 className="text-base font-semibold mb-3">Engines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {engines.map((e) => (
              <div key={e.name} className="rounded-xl border border-border bg-card p-5 hover:border-ring/40 transition">
                <div className="flex items-start justify-between">
                  <div className="h-9 w-9 rounded-lg bg-accent grid place-items-center">
                    <e.icon className="h-4 w-4 text-accent-foreground" strokeWidth={1.75} />
                  </div>
                  <span className={`text-[10px] uppercase tracking-wider font-medium px-1.5 py-0.5 rounded ${
                    e.status === "live" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
                  }`}>
                    {e.status}
                  </span>
                </div>
                <p className="mt-3 text-sm font-semibold">{e.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{e.desc}</p>
                <div className="mt-4 pt-3 border-t border-border flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Activity className="h-3 w-3" /> {e.calls}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Candidates */}
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="text-base font-semibold">Top matches · DM-2026-000145</h3>
            <span className="text-xs text-muted-foreground">Recomputed 2 minutes ago</span>
          </div>
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            {candidates.map((c) => (
              <div key={c.name} className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gradient-brand grid place-items-center text-sm font-semibold text-brand-foreground">
                  {c.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.role}</p>
                </div>
                <div className="hidden md:flex gap-1.5">
                  {c.badges.map((b) => (
                    <span key={b} className="text-[11px] px-2 py-0.5 rounded bg-muted text-muted-foreground">{b}</span>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground hidden sm:block">{c.gaps} gaps</div>
                <div className="w-32">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-muted-foreground">Match</span>
                    <span className="font-semibold">{c.match}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gradient-brand" style={{ width: `${c.match}%` }} />
                  </div>
                </div>
                <button className="text-xs h-8 px-3 rounded-md border border-border hover:bg-muted transition">View</button>
              </div>
            ))}
          </div>
        </div>
      </PageBody>
    </>
  );
}

function Node({
  icon: Icon,
  label,
  tone = "default",
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  tone?: "default" | "brand";
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`h-12 w-12 rounded-xl grid place-items-center border ${
        tone === "brand" ? "bg-accent border-accent text-accent-foreground" : "bg-surface-elevated border-border text-foreground"
      }`}>
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </div>
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </div>
  );
}
