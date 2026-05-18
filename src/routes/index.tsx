import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageBody, PageHeader, Section } from "@/components/page";
import { api } from "@/lib/api";
import {
  Sparkles,
  ArrowUpRight,
  Network,
  Briefcase,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview · ACCM" },
      { name: "description", content: "Your workforce intelligence at a glance — skills, demand, and orchestration." },
    ],
  }),
  component: Overview,
});

const fallbackKpis = [
  { label: "Open Demands", value: "128", delta: "+12", icon: Briefcase },
  { label: "Active Talent", value: "2,847", delta: "+96", icon: Users },
  { label: "Avg. Match Score", value: "84%", delta: "+3.1%", icon: Sparkles },
  { label: "Time to Staff", value: "6.2d", delta: "-1.4d", icon: Clock },
];

const fallbackActivity = [
  { who: "Maya Chen", what: "applied to", target: "Senior ML Engineer · DM-2026-000142", time: "2m ago", score: 92 },
  { who: "Copilot", what: "recommended 4 candidates for", target: "Cloud Architect · DM-2026-000139", time: "18m ago" },
  { who: "Workforce Forecast", what: "updated for", target: "Q3 — Data & AI cluster", time: "1h ago" },
  { who: "Aarav R.", what: "approved skill", target: "LangGraph Orchestration", time: "3h ago" },
];

const kpiIconByLabel = {
  "Open Demands": Briefcase,
  "Active Talent": Users,
  "Avg. Match Score": Sparkles,
  "Time to Staff": Clock,
} as const;

function Overview() {
  const overviewQuery = useQuery({ queryKey: ["overview"], queryFn: api.getOverview });
  const kpisFromApi = overviewQuery.data?.kpis;
  const kpis = (kpisFromApi && kpisFromApi.length > 0 ? kpisFromApi : fallbackKpis).map((k, index) => ({
    ...k,
    icon:
      kpiIconByLabel[k.label as keyof typeof kpiIconByLabel] ||
      fallbackKpis[index % fallbackKpis.length].icon,
  }));
  const activityFromApi = overviewQuery.data?.activity;
  const activity =
    activityFromApi && activityFromApi.length > 0 ? activityFromApi : fallbackActivity;

  return (
    <>
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-aurora pointer-events-none" />
        <div className="relative px-8 py-12 max-w-[1400px]">
          <p className="text-[11px] uppercase tracking-[0.14em] text-brand font-medium">
            Active Competency Cluster Model
          </p>
          <h1 className="mt-3 text-display text-5xl md:text-6xl leading-[1.02] max-w-3xl">
            A workforce <em className="text-display text-brand not-italic">operating system</em>{" "}
            for the AI era.
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground max-w-xl">
            Skills, demand, and people — orchestrated. ACCM connects your competency graph to a live
            internal marketplace, with AI matching that learns as you work.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              to="/marketplace"
              className="h-10 px-4 inline-flex items-center gap-2 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90 transition"
            >
              Open Marketplace <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
            </Link>
            <Link
              to="/skills"
              className="h-10 px-4 inline-flex items-center gap-2 rounded-md border border-border bg-surface-elevated text-sm font-medium hover:bg-muted transition"
            >
              Explore Skills Graph
            </Link>
          </div>
        </div>
      </div>

      <PageBody>
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map((k) => (
            <div
              key={k.label}
              className="rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-elevated transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{k.label}</span>
                <k.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl text-display tracking-tight">{k.value}</span>
                <span className="text-xs text-success font-medium">{k.delta}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Modules */}
          <div className="lg:col-span-2 space-y-4">
            <Section title="Platform modules" description="Four layers, one continuous workforce supply chain.">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ModuleCard
                  to="/skills"
                  icon={Network}
                  name="Skills Intelligence"
                  desc="Catalogue, matrix, and master — your living competency graph."
                />
                <ModuleCard
                  to="/marketplace"
                  icon={Briefcase}
                  name="Demand Marketplace"
                  desc="Workflow-driven internal demand with talent applications."
                />
                <ModuleCard
                  to="/ai-matching"
                  icon={Sparkles}
                  name="AI & Processing"
                  desc="Matching, forecasting, and risk — orchestrated intelligence."
                />
                <ModuleCard
                  to="/insights"
                  icon={TrendingUp}
                  name="Outcomes"
                  desc="Faster staffing, fewer gaps, stronger workforce resilience."
                />
              </div>
            </Section>
          </div>

          {/* Activity */}
          <Section title="Recent activity">
            <div className="rounded-xl border border-border bg-card divide-y divide-border">
              {activity.map((a, i) => (
                <div key={i} className="p-4 flex gap-3">
                  <div className="h-8 w-8 shrink-0 rounded-full bg-accent grid place-items-center">
                    <CheckCircle2 className="h-4 w-4 text-accent-foreground" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug">
                      <span className="font-medium">{a.who}</span>{" "}
                      <span className="text-muted-foreground">{a.what}</span>{" "}
                      <span className="font-medium">{a.target}</span>
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[11px] text-muted-foreground">{a.time}</span>
                      {a.score && (
                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-accent text-accent-foreground font-medium">
                          {a.score}% match
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </PageBody>
    </>
  );
}

function ModuleCard({
  to,
  icon: Icon,
  name,
  desc,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  name: string;
  desc: string;
}) {
  return (
    <Link
      to={to}
      className="group rounded-xl border border-border bg-card p-5 hover:border-ring/40 hover:shadow-elevated transition relative overflow-hidden"
    >
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-accent grid place-items-center">
          <Icon className="h-4 w-4 text-accent-foreground" strokeWidth={1.75} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">{name}</p>
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-brand transition" strokeWidth={1.75} />
      </div>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </Link>
  );
}
