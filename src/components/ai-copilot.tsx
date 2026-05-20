import { useEffect, useRef, useState } from "react";
import { Sparkles, X, Send, ArrowUpRight, Loader2, Check, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCopilot } from "@/components/copilot-provider";
import { CopilotMessageContent } from "@/lib/copilot-message-format";

const suggestions = [
  "Find Python engineers in EMEA available next month",
  "Show critical skill gaps in Cloud Architecture",
  "Forecast demand for AI/ML roles next quarter",
];

export function AICopilot() {
  const { open, setOpen, sending, messages, sendMessage, pendingAllocation, approveCandidate, approveAll, rejectAllocation } = useCopilot();
  const [input, setInput] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [open, messages, sending]);

  const submit = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setInput("");
    setShowSuggestions(false);
    await sendMessage(trimmed);
  };

  return (
    <>
      <button
        onClick={() => {
          setOpen(!open);
          setIsFullScreen(true);
        }}
        className={cn(
          "fixed bottom-6 right-6 z-40 h-12 px-4 inline-flex items-center gap-2 rounded-full",
          "bg-gradient-brand text-brand-foreground shadow-glow",
          "hover:scale-[1.02] transition-transform",
        )}
      >
        <Sparkles className="h-4 w-4" strokeWidth={2} />
        <span className="text-sm font-medium">Copilot</span>
      </button>

      {open && (
        <div
          className={cn(
            "fixed z-40 bg-surface-elevated border border-border shadow-elevated overflow-hidden flex flex-col",
            isFullScreen
              ? "top-0 left-0 w-full h-full rounded-none"
              : "bottom-24 right-6 w-[420px] max-h-[74vh] rounded-2xl",
          )}
        >
          <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-gradient-aurora">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-brand grid place-items-center">
                <Sparkles className="h-3.5 w-3.5 text-brand-foreground" strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm font-medium leading-none">ACCM Copilot</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Talent intelligence assistant
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setOpen(false);
                setIsFullScreen(false); // Reset to small mode
              }}
              className="h-7 w-7 grid place-items-center rounded-md hover:bg-muted"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "rounded-xl p-3 text-sm",
                  message.role === "assistant" ? "bg-muted/60" : "bg-accent text-accent-foreground",
                )}
              >
                {message.role === "assistant" ? (
                  <CopilotMessageContent content={message.content} />
                ) : (
                  <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                )}
              </div>
            ))}

            {sending && (
              <div
                className="rounded-xl border border-border/60 bg-muted/40 p-3 text-sm shadow-sm"
                role="status"
                aria-live="polite"
                aria-busy="true"
              >
                <div className="flex items-center gap-3">
                  <Loader2
                    className="h-4 w-4 shrink-0 animate-spin text-brand"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <div>
                    <p className="font-medium text-foreground">Working on your answer</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      This usually takes a few seconds.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {showSuggestions && !sending && (
              <div className="space-y-1.5">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground px-1">
                  Try asking
                </p>
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => void submit(s)}
                    className="w-full text-left text-sm rounded-lg border border-border bg-card px-3 py-2.5 hover:border-ring/40 hover:bg-accent/40 transition flex items-center justify-between gap-2 group"
                  >
                    <span className="leading-snug">{s}</span>
                    <ArrowUpRight
                      className="h-3.5 w-3.5 text-muted-foreground group-hover:text-brand transition"
                      strokeWidth={1.75}
                    />
                  </button>
                ))}
              </div>
            )}

            {pendingAllocation && (
              <div className="space-y-2 border border-border rounded-xl p-3 bg-card">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Available Candidates for {pendingAllocation.demandId}
                </p>
                {pendingAllocation.candidates.map((c) => (
                  <div
                    key={c.talent_id}
                    className="rounded-lg border border-border p-3 bg-muted/30 space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.role} · {c.location}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-green-600">{c.match}%</span>
                        <button
                          onClick={() => void approveCandidate(c.talent_id)}
                          disabled={sending}
                          className="shrink-0 h-7 w-7 grid place-items-center rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                          title="Approve"
                        >
                          <Check className="h-3.5 w-3.5" strokeWidth={2} />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {c.skills?.map((s) => (
                        <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-brand/10 text-brand font-medium">{s}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span>Cluster: <strong className="text-foreground">{c.cluster}</strong></span>
                      <span>Exp: <strong className="text-foreground">{c.experience_years}y</strong></span>
                      <span>Capacity: <strong className="text-foreground">{c.available_capacity}/{c.total_capacity}</strong></span>
                    </div>
                  </div>
                ))}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => void approveAll()}
                    disabled={sending}
                    className="flex-1 text-xs font-medium py-1.5 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    Approve All
                  </button>
                  <button
                    onClick={rejectAllocation}
                    disabled={sending}
                    className="flex-1 text-xs font-medium py-1.5 rounded-md border border-border hover:bg-destructive/10 text-destructive disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-border p-3">
            <div className="relative">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && input.trim()) {
                    e.preventDefault();
                    void submit(input);
                  }
                }}
                disabled={sending}
                placeholder="Ask Copilot…"
                className="w-full h-10 pl-3 pr-10 rounded-lg bg-muted text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 disabled:opacity-60"
              />
              <button
                onClick={() => void submit(input)}
                disabled={sending || !input.trim()}
                className="absolute right-1.5 top-1.5 h-7 w-7 grid place-items-center rounded-md bg-gradient-brand text-brand-foreground disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
