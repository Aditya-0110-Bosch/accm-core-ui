import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border-b border-border bg-background", className)}>
      <div className="px-8 py-8 max-w-[1400px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            {eyebrow && (
              <p className="text-[11px] uppercase tracking-[0.14em] text-brand font-medium">
                {eyebrow}
              </p>
            )}
            <h1 className="text-display text-4xl md:text-[44px] leading-[1.05] text-foreground">
              {title}
            </h1>
            {description && (
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    </div>
  );
}

export function PageBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-8 py-8 max-w-[1400px] space-y-8", className)}>{children}</div>;
}

export function Section({
  title,
  description,
  action,
  children,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      {(title || action) && (
        <div className="flex items-end justify-between gap-4">
          <div>
            {title && <h2 className="text-base font-semibold tracking-tight">{title}</h2>}
            {description && (
              <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
