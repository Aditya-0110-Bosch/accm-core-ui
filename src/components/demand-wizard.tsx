import { useState } from "react";
import { X, ArrowLeft, ArrowRight, Check, Sparkles, Briefcase, Network, MapPin, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export type Demand = {
  id: string;
  role: string;
  cluster: string;
  skills: string[];
  loc: string;
  duration: string;
  priority: "Critical" | "High" | "Medium";
  applicants: number;
  match: number;
  status: string;
  isNew?: boolean;
};

const CLUSTERS = [
  "Engineering & Cloud",
  "Data, AI & ML",
  "Product & Design",
  "Strategy & Consulting",
  "Cybersecurity",
];

const PRIORITIES: Demand["priority"][] = ["Critical", "High", "Medium"];

const STEPS = [
  { n: 1, t: "Project", icon: Briefcase },
  { n: 2, t: "Role & skills", icon: Network },
  { n: 3, t: "Resourcing", icon: MapPin },
  { n: 4, t: "Review", icon: Check },
];

export function nextDemandId(existing: Demand[]) {
  const year = new Date().getFullYear();
  const max = existing.reduce((m, d) => {
    const match = d.id.match(/DM-(\d{4})-(\d{6})/);
    if (!match) return m;
    return Math.max(m, parseInt(match[2], 10));
  }, 0);
  return `DM-${year}-${String(max + 1).padStart(6, "0")}`;
}

export function DemandWizard({
  open,
  onClose,
  onCreate,
  nextId,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (d: Demand) => void;
  nextId: string;
}) {
  const [step, setStep] = useState(1);
  const [project, setProject] = useState("");
  const [role, setRole] = useState("");
  const [cluster, setCluster] = useState(CLUSTERS[0]);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [experience, setExperience] = useState("5+ yrs");
  const [loc, setLoc] = useState("");
  const [duration, setDuration] = useState("6 months");
  const [priority, setPriority] = useState<Demand["priority"]>("High");
  const [count, setCount] = useState(1);

  if (!open) return null;

  const canNext =
    (step === 1 && project.trim()) ||
    (step === 2 && role.trim() && skills.length > 0) ||
    (step === 3 && loc.trim()) ||
    step === 4;

  const reset = () => {
    setStep(1);
    setProject(""); setRole(""); setCluster(CLUSTERS[0]);
    setSkills([]); setSkillInput("");
    setExperience("5+ yrs"); setLoc(""); setDuration("6 months");
    setPriority("High"); setCount(1);
  };

  const addSkill = () => {
    const v = skillInput.trim();
    if (!v || skills.includes(v)) return;
    setSkills([...skills, v]);
    setSkillInput("");
  };

  const submit = () => {
    onCreate({
      id: nextId,
      role: role.trim(),
      cluster,
      skills,
      loc: loc.trim(),
      duration,
      priority,
      applicants: 0,
      match: 0,
      status: "Draft",
      isNew: true,
    });
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-foreground/30 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl max-h-[88vh] overflow-hidden rounded-2xl bg-surface-elevated border border-border shadow-elevated flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-gradient-aurora">
          <div>
            <p className="text-[11px] uppercase tracking-wider font-medium text-brand">Demand Wizard</p>
            <h2 className="text-lg font-semibold tracking-tight mt-0.5">Create a new demand</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono px-2 py-1 rounded bg-surface-elevated/80 border border-border text-muted-foreground">
              {nextId}
            </span>
            <button onClick={() => { reset(); onClose(); }} className="h-8 w-8 grid place-items-center rounded-md hover:bg-muted">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Stepper */}
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          {STEPS.map((s, i) => {
            const active = step === s.n;
            const done = step > s.n;
            return (
              <div key={s.n} className="flex items-center flex-1 last:flex-none gap-2">
                <div className={cn(
                  "h-7 w-7 grid place-items-center rounded-full text-[11px] font-semibold shrink-0 transition",
                  done && "bg-success text-background",
                  active && "bg-gradient-brand text-brand-foreground shadow-glow",
                  !active && !done && "bg-muted text-muted-foreground"
                )}>
                  {done ? <Check className="h-3.5 w-3.5" /> : s.n}
                </div>
                <div className="hidden sm:block min-w-0">
                  <div className={cn("text-xs font-medium truncate", active ? "text-foreground" : "text-muted-foreground")}>{s.t}</div>
                </div>
                {i < STEPS.length - 1 && <div className={cn("flex-1 h-px", done ? "bg-success" : "bg-border")} />}
              </div>
            );
          })}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {step === 1 && (
            <div className="space-y-4">
              <Field label="Project name">
                <input
                  autoFocus
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  placeholder="e.g. Project Atlas — Trading Platform Modernization"
                  className="input"
                />
              </Field>
              <Field label="Project owner">
                <input defaultValue="Aarav Raman" className="input" />
              </Field>
              <Field label="Brief">
                <textarea
                  rows={3}
                  placeholder="What is this demand for? Copilot will help draft the spec…"
                  className="input resize-none"
                />
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Field label="Role title">
                <input
                  autoFocus
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Cloud Architect"
                  className="input"
                />
              </Field>
              <Field label="Skill cluster">
                <div className="flex flex-wrap gap-1.5">
                  {CLUSTERS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCluster(c)}
                      className={cn(
                        "text-xs px-3 py-1.5 rounded-md border transition",
                        cluster === c
                          ? "bg-accent border-transparent text-accent-foreground font-medium"
                          : "border-border bg-card hover:border-ring/40"
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Primary skills" hint="Press Enter to add">
                <div className="rounded-md border border-input bg-card px-2 py-1.5 flex flex-wrap items-center gap-1.5 focus-within:ring-2 focus-within:ring-ring/30">
                  {skills.map((s) => (
                    <span key={s} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-accent text-accent-foreground">
                      {s}
                      <button type="button" onClick={() => setSkills(skills.filter((x) => x !== s))}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { e.preventDefault(); addSkill(); }
                    }}
                    placeholder={skills.length === 0 ? "e.g. Kubernetes, Terraform…" : ""}
                    className="flex-1 min-w-[120px] bg-transparent text-sm py-1 px-1 outline-none"
                  />
                </div>
                {skills.length > 0 && (
                  <p className="mt-2 text-[11px] text-brand inline-flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Copilot suggests: Service Mesh, FinOps, EKS
                  </p>
                )}
              </Field>
              <Field label="Experience">
                <select value={experience} onChange={(e) => setExperience(e.target.value)} className="input">
                  {["0–2 yrs", "2–5 yrs", "5+ yrs", "8+ yrs", "12+ yrs"].map((e) => <option key={e}>{e}</option>)}
                </select>
              </Field>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Location">
                  <input
                    autoFocus
                    value={loc}
                    onChange={(e) => setLoc(e.target.value)}
                    placeholder="e.g. Bengaluru · Hybrid"
                    className="input"
                  />
                </Field>
                <Field label="Duration">
                  <select value={duration} onChange={(e) => setDuration(e.target.value)} className="input">
                    {["3 months", "6 months", "9 months", "12 months", "18 months"].map((d) => <option key={d}>{d}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Number of resources">
                <input
                  type="number" min={1} max={50}
                  value={count}
                  onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="input w-32"
                />
              </Field>
              <Field label="Priority">
                <div className="flex gap-1.5">
                  {PRIORITIES.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={cn(
                        "text-xs px-3 py-1.5 rounded-md border transition",
                        priority === p ? "bg-foreground text-background border-transparent" : "border-border hover:bg-muted"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Review the demand. On submit, ID <span className="font-mono text-foreground">{nextId}</span> will be issued and the card published to the marketplace.
              </p>
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-muted-foreground">{nextId}</span>
                    <h3 className="text-base font-semibold mt-1">{role || "—"}</h3>
                    <p className="text-xs text-muted-foreground">{cluster}</p>
                  </div>
                  <span className={cn(
                    "text-[11px] px-1.5 py-0.5 rounded font-medium",
                    priority === "Critical" && "bg-destructive/10 text-destructive",
                    priority === "High" && "bg-warning/15 text-warning",
                    priority === "Medium" && "bg-info/10 text-info",
                  )}>{priority}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {skills.map((s) => (
                    <span key={s} className="text-[11px] px-2 py-0.5 rounded bg-muted text-muted-foreground">{s}</span>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{loc || "—"}</span>
                    <span>·</span>
                    <span>{duration}</span>
                  </div>
                  <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" />{count} {count === 1 ? "seat" : "seats"}</span>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Project: <span className="text-foreground">{project || "—"}</span> · Experience: <span className="text-foreground">{experience}</span>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-surface">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className="h-9 px-3 inline-flex items-center gap-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => { reset(); onClose(); }} className="h-9 px-3 text-sm text-muted-foreground hover:text-foreground">
              Cancel
            </button>
            {step < 4 ? (
              <button
                type="button"
                disabled={!canNext}
                onClick={() => setStep(step + 1)}
                className="h-9 px-4 inline-flex items-center gap-1.5 rounded-md bg-foreground text-background text-sm font-medium disabled:opacity-40 transition"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                className="h-9 px-4 inline-flex items-center gap-1.5 rounded-md bg-gradient-brand text-brand-foreground text-sm font-medium shadow-glow"
              >
                <Sparkles className="h-4 w-4" /> Publish demand
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          height: 2.25rem;
          border-radius: 0.375rem;
          border: 1px solid var(--color-input);
          background: var(--color-card);
          padding: 0 0.75rem;
          font-size: 0.875rem;
          color: var(--color-foreground);
          outline: none;
          transition: box-shadow .15s, border-color .15s;
        }
        textarea.input { height: auto; padding: 0.5rem 0.75rem; line-height: 1.5; }
        .input:focus { border-color: var(--color-ring); box-shadow: 0 0 0 3px oklch(0.55 0.21 280 / 0.15); }
      `}</style>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-xs font-medium text-foreground">{label}</span>
        {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </label>
  );
}
