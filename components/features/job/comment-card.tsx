import { PostMarker } from "@/components/ui/post-marker";
import { UserPill } from "@/components/ui/user-pill";

export function CommentCard({
  initials,
  author,
  timestamp,
  content,
  marker,
  isReply = false,
  tone = "default",
  actionLabel,
}: {
  initials: string;
  author: string;
  timestamp: string;
  content: string;
  marker?: { variant: "op" | "official" | "moderator"; label?: string };
  isReply?: boolean;
  tone?: "default" | "reply";
  actionLabel?: string;
}) {
  const wrapperClass = isReply
    ? "bg-accent/30 p-4 border border-border flex-1 min-w-0"
    : "flex-1 min-w-0";

  return (
    <div className={`flex gap-4 ${isReply ? "pl-14" : ""}`}>
      <UserPill initials={initials} tone={tone === "reply" ? "highlight" : "default"} size={isReply ? "sm" : "md"} />
      <div className={wrapperClass}>
        <div className="flex items-baseline gap-2 mb-1 flex-wrap">
          <span className="font-bold text-primary text-lg flex items-center gap-2 flex-wrap">
            {author}
            {marker ? <PostMarker variant={marker.variant}>{marker.label}</PostMarker> : null}
          </span>
          <span className="text-sm text-muted-foreground">{timestamp}</span>
        </div>
        <p className="text-secondary text-lg">{content}</p>
        {actionLabel ? (
          <button className="text-sm font-bold text-cta hover:underline mt-2">{actionLabel}</button>
        ) : null}
      </div>
    </div>
  );
}
