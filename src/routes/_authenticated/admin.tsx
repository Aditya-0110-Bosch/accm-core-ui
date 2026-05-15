import { createFileRoute } from "@tanstack/react-router";
import { PageBody, PageHeader } from "@/components/page";
import { CheckCircle2, Clock, ShieldCheck, GitBranch, Users } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin & Governance · ACCM" },
      { name: "description", content: "Skill governance, approvals, and platform administration." },
    ],
  }),
  component: Admin,
});

function Admin() {
  return (
    <>
      <PageHeader
        eyebrow="Admin & Governance"
        title="Govern the model that runs your workforce"
        description="Skill ownership, approval workflows, and audit-grade traceability — by design."
      />

      <PageBody>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: ShieldCheck, label: "Approval queue", value: "12", sub: "awaiting review" },
            { icon: GitBranch, label: "Skill versions", value: "284", sub: "this quarter" },
            { icon: Users, label: "Skill owners", value: "46", sub: "across 8 domains" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-accent grid place-items-center">
                <s.icon className="h-4 w-4 text-accent-foreground" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-display text-2xl tracking-tight mt-0.5">{s.value}</p>
                <p className="text-[11px] text-muted-foreground">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="text-base font-semibold">Approval queue</h3>
            <span className="text-xs text-muted-foreground">Sorted by SLA</span>
          </div>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="grid grid-cols-12 px-4 py-2.5 text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border bg-surface">
              <div className="col-span-5">Skill</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-2">Owner</div>
              <div className="col-span-2">SLA</div>
              <div className="col-span-1"></div>
            </div>
            {[
              { s: "LangGraph Orchestration", t: "New skill", o: "AI Platform", sla: "2h left", urgent: true },
              { s: "Service Mesh (Istio) v3", t: "Version", o: "Platform Eng", sla: "1d", urgent: false },
              { s: "EU AI Act Compliance", t: "New skill", o: "Risk & Compliance", sla: "4h", urgent: true },
              { s: "Prompt Engineering", t: "Reclassify", o: "AI Platform", sla: "2d", urgent: false },
              { s: "Postgres pgvector", t: "Merge", o: "Data Platforms", sla: "3d", urgent: false },
            ].map((r) => (
              <div key={r.s} className="grid grid-cols-12 px-4 py-3.5 text-sm items-center border-b last:border-0 border-border hover:bg-muted/30">
                <div className="col-span-5 font-medium">{r.s}</div>
                <div className="col-span-2"><span className="text-xs px-2 py-0.5 rounded bg-muted">{r.t}</span></div>
                <div className="col-span-2 text-muted-foreground text-xs">{r.o}</div>
                <div className="col-span-2 text-xs inline-flex items-center gap-1">
                  <Clock className={`h-3 w-3 ${r.urgent ? "text-destructive" : "text-muted-foreground"}`} />
                  <span className={r.urgent ? "text-destructive font-medium" : "text-muted-foreground"}>{r.sla}</span>
                </div>
                <div className="col-span-1 flex justify-end">
                  <button className="text-xs h-7 px-2.5 rounded-md bg-foreground text-background font-medium inline-flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-base font-semibold">Audit log</h3>
            <ul className="mt-3 space-y-3 text-sm">
              {[
                { t: "Skill 'LLM Eval' published v2.1", who: "AI Platform", time: "12m ago" },
                { t: "Cluster ownership transferred · Cybersecurity", who: "Risk & Compliance", time: "2h ago" },
                { t: "Demand DM-2026-000139 approved", who: "Aarav R.", time: "5h ago" },
                { t: "API key rotated · matching-engine", who: "System", time: "1d ago" },
              ].map((l) => (
                <li key={l.t} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="leading-snug">{l.t}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{l.who}</p>
                  </div>
                  <span className="text-[11px] text-muted-foreground shrink-0">{l.time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-base font-semibold">Platform health</h3>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {[
                { l: "Skills Master sync", v: "Healthy" },
                { l: "Matching engine", v: "Healthy" },
                { l: "Forecast pipelines", v: "Healthy" },
                { l: "Identity provider", v: "Degraded", warn: true },
              ].map((s) => (
                <div key={s.l} className="rounded-lg border border-border bg-surface p-3">
                  <p className="text-[11px] text-muted-foreground">{s.l}</p>
                  <p className={`text-sm font-medium mt-0.5 inline-flex items-center gap-1.5 ${s.warn ? "text-warning" : "text-success"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${s.warn ? "bg-warning" : "bg-success"} animate-pulse-soft`} />
                    {s.v}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageBody>
    </>
  );
}
