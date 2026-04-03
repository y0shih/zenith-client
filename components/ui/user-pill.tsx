import { cn } from "@/lib/utils";

export function UserPill({
  initials,
  tone = "default",
  size = "md",
  className,
}: {
  initials: string;
  tone?: "default" | "primary" | "highlight";
  size?: "sm" | "md";
  className?: string;
}) {
  const toneClass = {
    default: "bg-secondary text-white",
    primary: "bg-accent text-primary border border-border",
    highlight: "bg-chart-1 text-white border-2 border-primary",
  }[tone];

  const sizeClass = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
  }[size];

  return (
    <div
      className={cn(
        "shrink-0 rounded-none flex items-center justify-center font-bold uppercase",
        toneClass,
        sizeClass,
        className
      )}
    >
      {initials}
    </div>
  );
}
