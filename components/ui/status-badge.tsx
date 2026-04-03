import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusTone = "neutral" | "info" | "success" | "warning" | "danger";

const toneClasses: Record<StatusTone, string> = {
  neutral: "border-border bg-muted text-foreground",
  info: "border-primary/20 bg-primary/10 text-primary",
  success: "border-chart-2/20 bg-chart-2/10 text-chart-2",
  warning: "border-chart-3/20 bg-chart-3/10 text-chart-3",
  danger: "border-destructive/20 bg-destructive/10 text-destructive",
};

export function StatusBadge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: StatusTone;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-none border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em]",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </Badge>
  );
}
