import { createFileRoute } from "@tanstack/react-router";
import { PageBody, PageHeader } from "@/components/page";
import { MapPin, Clock, Users, Sparkles, ArrowRight, Filter, Plus, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Demand Marketplace · ACCM" },
      { name: "description", content: "Workflow-driven internal demand with AI-powered talent applications." },
    ],
  }),
  component: Marketplace,
});

const demands = [
  {
    id: "DM-2026-000145",
    role: "Senior ML Engineer",
    cluster: "Data, AI & ML",
    skills: ["LLM Eval", "PyTorch", "Vector DB"],
    loc: "Bengaluru · Hybrid",
    duration: "9 months",
    priority: "Critical",
    applicants: 14,
    match: 92,
    status: "Sourcing",
  },
  {
    id: "DM-2026-000142",
    role: "Cloud Architect",
    cluster: "Engineering & Cloud",
    skills: ["AWS", "Terraform", "EKS"],
    loc: "London · Remote",
    duration: "12 months",
    priority: "High",
    applicants: 28,
    match: 87,
    status: "Shortlisting",
  },
  {
    id: "DM-2026-000139",
    role: "Product Designer, Platform",
    cluster: "Product & Design",
    skills: ["Design Systems", "Figma", "Research"],
    loc: "Remote · EMEA",
    duration: "6 months",
    priority: "Medium",
    applicants: 22,
    match: 81,
    status: "Sourcing",
  },
  {
    id: "DM-2026-000136",
    role: "Forward Deployed Engineer",
    cluster: "Strategy & Consulting",
    skills: ["Python", "Client Delivery", "RAG"],
    loc: "New York · Onsite",
    duration: "18 months",
    priority: "Critical",
    applicants: 9,
    match: 78,
    status: "Approved",
  },
];

const stages = ["Draft", "Approved", "Sourcing", "Shortlisting", "Fulfilled"];

function Marketplace() {
  return (
    <>
      <PageHeader
        eyebrow="Demand Allocation"
        title="Demand Marketplace"
        description="Create demand. Match talent. Track fulfillment — all in one continuous workflow."
        actions={
          <>
            <button className="h-9 px-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-elevated text-sm font-medium hover:bg-muted transition">
              <Filter className="h-4 w-4" /> Filter
            </button>
            <button className="h-9 px-3.5 inline-flex items-center gap-1.5 rounded-md bg-gradient-brand text-brand-foreground text-sm font-medium shadow-sm">
              <Plus className="h-4 w-4" /> New Demand
            </button>
          </>
        }
      />

      <PageBody>
        {/* Wizard preview */}
        <div className="rounded-2xl border border-border bg-card p-6 bg-gradient-aurora">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-wider font-medium text-brand">Demand Wizard</p>
              <h3 className="text-display text-2xl mt-1">Create demand in 4 guided steps</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                Project, role, skills, and resourcing — Copilot drafts the spec while you type.
              </p>
            </div>
            <button className="h-10 px-4 rounded-md bg-foreground text-background text-sm font-medium inline-flex items-center gap-2">
              Start wizard <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { n: "1", t: "Project", d: "Name, owner, timeline" },
              { n: "2", t: "Role & skills", d: "Cluster + primaries" },
              { n: "3", t: "Resourcing", d: "Loc, duration, count" },
              { n: "4", t: "Approve", d: "Routing & sign-off" },
            ].map((s) => (
              <div key={s.n} className="rounded-lg bg-surface-elevated/80 backdrop-blur border border-border p-3">
                <div className="text-[11px] text-brand font-semibold">Step {s.n}</div>
                <div className="text-sm font-medium mt-0.5">{s.t}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold">Pipeline</h2>
            <span className="text-xs text-muted-foreground">128 active demands</span>
          </div>
          <div className="rounded-xl border border-border bg-card p-2 flex">
            {stages.map((s, i) => (
              <div key={s} className="flex-1 flex items-center gap-2 px-3 py-2">
                <span className={cn(
                  "h-6 w-6 grid place-items-center rounded-full text-[11px] font-semibold",
                  i <= 2 ? "bg-gradient-brand text-brand-foreground" : "bg-muted text-muted-foreground"
                )}>{i + 1}</span>
                <div>
                  <div className="text-sm font-medium">{s}</div>
                  <div className="text-[11px] text-muted-foreground">{[12, 18, 64, 22, 12][i]} demands</div>
                </div>
                {i < stages.length - 1 && <div className="flex-1 h-px bg-border ml-2" />}
              </div>
            ))}
          </div>
        </div>

        {/* Demand cards */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold">Open demands</h2>
            <div className="flex gap-1 text-xs">
              {["All", "Critical", "Mine", "Closing soon"].map((t, i) => (
                <button key={t} className={cn(
                  "px-2.5 py-1 rounded-md transition",
                  i === 0 ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"
                )}>{t}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {demands.map((d) => (
              <div key={d.id} className="rounded-xl border border-border bg-card p-5 hover:border-ring/40 hover:shadow-elevated transition">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-muted-foreground">{d.id}</span>
                      <span className={cn(
                        "text-[11px] px-1.5 py-0.5 rounded font-medium",
                        d.priority === "Critical" && "bg-destructive/10 text-destructive",
                        d.priority === "High" && "bg-warning/15 text-warning",
                        d.priority === "Medium" && "bg-info/10 text-info",
                      )}>{d.priority}</span>
                    </div>
                    <h3 className="text-base font-semibold mt-1.5">{d.role}</h3>
                    <p className="text-xs text-muted-foreground">{d.cluster}</p>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 text-xs font-medium text-brand bg-accent px-2 py-1 rounded-md">
                      <Sparkles className="h-3 w-3" /> {d.match}%
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {d.skills.map((s) => (
                    <span key={s} className="text-[11px] px-2 py-0.5 rounded bg-muted text-muted-foreground">{s}</span>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{d.loc}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{d.duration}</span>
                  </div>
                  <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" />{d.applicants} applicants</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application timeline */}
        <div>
          <h2 className="text-base font-semibold mb-3">Application timeline · DM-2026-000142</h2>
          <div className="rounded-xl border border-border bg-card p-6">
            <ol className="relative ml-3 border-l border-border space-y-5">
              {[
                { t: "Applied", d: "Maya Chen submitted profile · 92% match", time: "2h ago", done: true },
                { t: "Screened by Copilot", d: "Skill gap: Service Mesh · suggested learning path", time: "1h 50m ago", done: true },
                { t: "Shortlisted", d: "Moved to Round 1 by Aarav R.", time: "45m ago", done: true },
                { t: "Interview", d: "Scheduled for May 18, 14:00 IST", time: "Upcoming" },
                { t: "Offer", d: "Awaiting decision", time: "—" },
              ].map((s, i) => (
                <li key={i} className="ml-4">
                  <span className={cn(
                    "absolute -left-[7px] h-3.5 w-3.5 rounded-full border-2 border-background",
                    s.done ? "bg-gradient-brand" : "bg-muted"
                  )} />
                  <div className="flex items-baseline justify-between">
                    <p className="text-sm font-medium flex items-center gap-1.5">
                      {s.done && <CheckCircle2 className="h-3.5 w-3.5 text-success" />}
                      {s.t}
                    </p>
                    <span className="text-[11px] text-muted-foreground">{s.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </PageBody>
    </>
  );
}
