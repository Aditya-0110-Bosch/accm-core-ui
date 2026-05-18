import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageBody, PageHeader } from "@/components/page";
import { Briefcase, GraduationCap, ArrowRight, Sparkles, MapPin, FileText } from "lucide-react";
import { api } from "@/lib/api";

export const Route = createFileRoute("/talent")({
  head: () => ({
    meta: [
      { title: "Talent Workspace · ACCM" },
      { name: "description", content: "Your profile, applications, and personalized career pathways." },
    ],
  }),
  component: Talent,
});

function Talent() {
  const talentQuery = useQuery({ queryKey: ["talent"], queryFn: api.getTalent });
  const profile = talentQuery.data?.profile || {
    name: "Aarav Raman",
    location: "Bengaluru",
    role: "Senior Engineer",
    completeness: 86,
  };
  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <>
      <PageHeader
        eyebrow="Talent Workspace"
        title="Welcome back, Aarav"
        description="Track applications, sharpen your skills, and discover roles that fit where you're going."
      />

      <PageBody>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile */}
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-2xl border border-border bg-card p-6 bg-gradient-aurora">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-full bg-gradient-brand grid place-items-center text-lg font-semibold text-brand-foreground">
                  {initials}
                </div>
                <div>
                  <p className="text-base font-semibold">{profile.name}</p>
                  <p className="text-xs text-muted-foreground">{profile.role} · {profile.location}</p>
                </div>
              </div>
              <div className="mt-5">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">Profile completeness</span>
                  <span className="font-semibold">{profile.completeness}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-gradient-brand" style={{ width: `${profile.completeness}%` }} />
                </div>
              </div>
              <button className="mt-4 w-full h-9 rounded-md bg-foreground text-background text-sm font-medium inline-flex items-center justify-center gap-1.5">
                <FileText className="h-4 w-4" /> Update profile
              </button>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-3">Top skills</p>
              <div className="flex flex-wrap gap-1.5">
                {(talentQuery.data?.topSkills || ["Kubernetes", "AWS", "Terraform", "Go", "Postgres", "RAG", "System Design"]).map((s) => (
                  <span key={s} className="text-xs px-2.5 py-1 rounded-md bg-muted">{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="lg:col-span-2 space-y-6">
            {/* Applications */}
            <div>
              <h3 className="text-base font-semibold mb-3">My applications</h3>
              <div className="rounded-xl border border-border bg-card divide-y divide-border">
                {(talentQuery.data?.applications || [
                  { id: "DM-2026-000142", role: "Cloud Architect", stage: "Shortlisted", match: 91 },
                  { id: "DM-2026-000128", role: "Platform Engineer", stage: "Interview", match: 88 },
                  { id: "DM-2026-000117", role: "SRE Lead", stage: "Submitted", match: 79 },
                ]).map((a) => (
                  <div key={a.id} className="p-4 flex items-center gap-4">
                    <div className="h-9 w-9 rounded-md bg-accent grid place-items-center">
                      <Briefcase className="h-4 w-4 text-accent-foreground" strokeWidth={1.75} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{a.role}</p>
                      <p className="text-[11px] font-mono text-muted-foreground">{a.id}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded bg-muted">{a.stage}</span>
                    <div className="text-xs font-semibold text-brand">{a.match}%</div>
                    <button className="h-8 w-8 grid place-items-center rounded-md hover:bg-muted">
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold">Recommended for you</h3>
                <span className="inline-flex items-center gap-1 text-xs text-brand">
                  <Sparkles className="h-3 w-3" /> AI matched
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(talentQuery.data?.recommendations || [
                  { role: "Principal Cloud Architect", match: 94, loc: "Remote · APAC" },
                  { role: "Platform Tech Lead", match: 90, loc: "Bengaluru" },
                  { role: "Staff SRE", match: 87, loc: "Hybrid · Hyderabad" },
                  { role: "Solutions Architect", match: 84, loc: "Remote" },
                ]).map((r) => (
                  <div key={r.role} className="rounded-xl border border-border bg-card p-4 hover:border-ring/40 transition">
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-semibold">{r.role}</p>
                      <span className="text-xs font-semibold text-brand bg-accent px-2 py-0.5 rounded">{r.match}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {r.loc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pathway */}
            <div>
              <h3 className="text-base font-semibold mb-3">Career pathway</h3>
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {["Senior Engineer", "Cloud Architect", "Platform Lead", "Distinguished Engineer"].map((r, i, arr) => (
                    <div key={r} className="flex items-center gap-2 shrink-0">
                      <div className={`px-3 py-2 rounded-lg border text-xs ${
                        i === 0 ? "bg-accent text-accent-foreground border-transparent font-semibold" : "border-border bg-surface-elevated"
                      }`}>
                        {r}
                      </div>
                      {i < arr.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />}
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="rounded-lg bg-muted/60 p-3 flex items-start gap-2">
                    <GraduationCap className="h-4 w-4 text-brand mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Close gap: Service Mesh</p>
                      <p className="text-xs text-muted-foreground">3-week guided path · 4 hrs/wk</p>
                    </div>
                  </div>
                  <div className="rounded-lg bg-muted/60 p-3 flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-brand mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Mentor match available</p>
                      <p className="text-xs text-muted-foreground">2 Cloud Architects in your org</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageBody>
    </>
  );
}
