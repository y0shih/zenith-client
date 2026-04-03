import { cn } from "@/lib/utils";

type PostMarkerVariant = "op" | "official" | "moderator";

const variantStyles: Record<PostMarkerVariant, string> = {
  op: "bg-primary text-white border-primary",
  official: "bg-chart-2/15 text-chart-2 border-chart-2",
  moderator: "bg-chart-3/15 text-chart-3 border-chart-3",
};

const variantLabels: Record<PostMarkerVariant, string> = {
  op: "OP",
  official: "Official",
  moderator: "Mod",
};

export function PostMarker({
  variant = "op",
  className,
  children,
}: {
  variant?: PostMarkerVariant;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em]",
        variantStyles[variant],
        className
      )}
    >
      {children ?? variantLabels[variant]}
    </span>
  );
}
