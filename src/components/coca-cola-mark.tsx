/**
 * Lightweight Coca-Cola style script wordmark.
 * Uses the Pacifico font as a free script approximation — kept small and
 * monochrome so it reads as a co-branding mark, not a forged logo.
 */
export function CocaColaMark({
  className = "",
  tone = "brand",
}: {
  className?: string;
  tone?: "brand" | "white" | "ink";
}) {
  const color =
    tone === "white"
      ? "text-white"
      : tone === "ink"
      ? "text-foreground"
      : "text-brand";
  return (
    <span
      className={`font-script leading-none select-none ${color} ${className}`}
      aria-label="Coca-Cola"
    >
      Coca-Cola
    </span>
  );
}

export function CocaColaBadge({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-3 py-1 ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse-soft" />
      <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">
        Powered for
      </span>
      <CocaColaMark className="text-base" />
    </div>
  );
}
