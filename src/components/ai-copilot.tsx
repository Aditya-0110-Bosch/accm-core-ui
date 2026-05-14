import { useState } from "react";
import { Sparkles, X, Send, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const suggestions = [
  "Find Python engineers in EMEA available next month",
  "Show critical skill gaps in Cloud Architecture",
  "Forecast demand for AI/ML roles next quarter",
];

export function AICopilot() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "fixed bottom-6 right-6 z-40 h-12 px-4 inline-flex items-center gap-2 rounded-full",
          "bg-gradient-brand text-brand-foreground shadow-glow",
          "hover:scale-[1.02] transition-transform"
        )}
      >
        <Sparkles className="h-4 w-4" strokeWidth={2} />
        <span className="text-sm font-medium">Copilot</span>
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-[380px] max-h-[70vh] rounded-2xl bg-surface-elevated border border-border shadow-elevated overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-gradient-aurora">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-brand grid place-items-center">
                <Sparkles className="h-3.5 w-3.5 text-brand-foreground" strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm font-medium leading-none">ACCM Copilot</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Talent intelligence assistant</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="h-7 w-7 grid place-items-center rounded-md hover:bg-muted">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="rounded-xl bg-muted/60 p-3 text-sm">
              <p className="text-foreground leading-relaxed">
                Hi Aarav — I can help you build demands, surface candidates, and analyze workforce signals. What would you like to do?
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground px-1">
                Try asking
              </p>
              {suggestions.map((s) => (
                <button
                  key={s}
                  className="w-full text-left text-sm rounded-lg border border-border bg-card px-3 py-2.5 hover:border-ring/40 hover:bg-accent/40 transition flex items-center justify-between gap-2 group"
                >
                  <span className="leading-snug">{s}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-brand transition" strokeWidth={1.75} />
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-border p-3">
            <div className="relative">
              <input
                placeholder="Ask Copilot…"
                className="w-full h-10 pl-3 pr-10 rounded-lg bg-muted text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
              <button className="absolute right-1.5 top-1.5 h-7 w-7 grid place-items-center rounded-md bg-gradient-brand text-brand-foreground">
                <Send className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
