import { createFileRoute } from "@tanstack/react-router";
import { PageBody, PageHeader } from "@/components/page";
import { TrendingUp, TrendingDown, Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Workforce Insights · ACCM" },
      { name: "description", content: "Strategic workforce planning, forecasting, and outcomes." },
    ],
  }),
  component: Insights,
});

const outcomes = [
  { label: "Time to staff", value: "6.2d", delta: -28, positive: true, sub: "vs. 8.6d baseline" },
  { label: "Internal mobility", value: "34%", delta: 11, positive: true, sub: "of fulfilled demands" },
  { label: "Skill gap closure", value: "78%", delta: 6, positive: true, sub: "across critical clusters" },
  { label: "Bench utilization", value: "91%", delta: 4, positive: true, sub: "this quarter" },
];

function Insights() {
  return (
    <>
      <PageHeader
        eyebrow="Outcomes & Impact"
        title="Workforce Insights"
        description="The business value of an active competency model — measured continuously."
      />

      <PageBody>
        {/* Outcomes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {outcomes.map((o) => (
            <div key={o.label} className="rounded-xl border border-border bg-card p-5">
              <p className="text-xs text-muted-foreground">{o.label}</p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-display text-3xl tracking-tight">{o.value}</span>
                <span className={`text-xs font-medium inline-flex items-center gap-0.5 ${o.positive ? "text-success" : "text-destructive"}`}>
                  {o.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(o.delta)}%
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5">{o.sub}</p>
            </div>
          ))}
        </div>

        {/* Capability maturity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
            <h3 className="text-base font-semibold">Capability maturity by cluster</h3>
            <p className="text-sm text-muted-foreground">Where you are vs. where you need to be.</p>
            <div className="mt-6 space-y-4">
              {[
                { c: "Data, AI & ML", current: 72, target: 90 },
                { c: "Cloud Architecture", current: 84, target: 88 },
                { c: "Cybersecurity", current: 58, target: 80 },
                { c: "Product & Design", current: 76, target: 82 },
                { c: "Strategy & Consulting", current: 80, target: 85 },
              ].map((r) => (
                <div key={r.c}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium">{r.c}</span>
                    <span className="text-muted-foreground">{r.current}% / {r.target}% target</span>
                  </div>
                  <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                    <div className="absolute inset-y-0 left-0 bg-gradient-brand rounded-full" style={{ width: `${r.current}%` }} />
                    <div className="absolute top-0 bottom-0 w-px bg-foreground/40" style={{ left: `${r.target}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 bg-gradient-aurora">
            <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-medium text-brand">
              <Sparkles className="h-3 w-3" /> Strategic recommendation
            </div>
            <h3 className="text-display text-2xl mt-3 leading-tight">
              Build internal Cybersecurity capacity by Q3.
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              Demand is forecast to grow 42% next quarter. 64 internal candidates qualify with a 6-week
              guided pathway.
            </p>
            <button className="mt-5 h-9 px-3.5 rounded-md bg-foreground text-background text-sm font-medium inline-flex items-center gap-1.5">
              Open plan <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Forecast */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-baseline justify-between">
            <div>
              <h3 className="text-base font-semibold">Demand vs. supply forecast</h3>
              <p className="text-sm text-muted-foreground">Next 4 quarters · normalized</p>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-brand" /> Demand</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-muted-foreground" /> Supply</span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-4 gap-4 items-end h-48">
            {[
              { q: "Q2", d: 60, s: 72 },
              { q: "Q3", d: 78, s: 70 },
              { q: "Q4", d: 88, s: 74 },
              { q: "Q1", d: 95, s: 80 },
            ].map((b) => (
              <div key={b.q} className="flex flex-col items-center gap-2">
                <div className="w-full flex items-end gap-1.5 h-40">
                  <div className="flex-1 rounded-t-md bg-gradient-brand" style={{ height: `${b.d}%` }} />
                  <div className="flex-1 rounded-t-md bg-muted-foreground/30" style={{ height: `${b.s}%` }} />
                </div>
                <span className="text-xs text-muted-foreground">{b.q}</span>
              </div>
            ))}
          </div>
        </div>
      </PageBody>
    </>
  );
}
