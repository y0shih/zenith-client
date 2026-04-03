import { CommentCard } from "@/components/features/job/comment-card";

type CommentItem = {
  initials: string;
  author: string;
  timestamp: string;
  content: string;
  actionLabel?: string;
  marker?: { variant: "op" | "official" | "moderator"; label?: string };
};

export function CommentThread({
  root,
  replies = [],
}: {
  root: CommentItem;
  replies?: readonly CommentItem[];
}) {
  return (
    <div className="space-y-4">
      <CommentCard {...root} />
      {replies.map((reply) => (
        <CommentCard key={`${reply.author}-${reply.timestamp}`} {...reply} isReply tone="reply" />
      ))}
    </div>
  );
}
