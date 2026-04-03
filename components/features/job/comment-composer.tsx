import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserPill } from "@/components/ui/user-pill";

export function CommentComposer({
  initials = "You",
  placeholder = "Write a reply...",
}: {
  initials?: string;
  placeholder?: string;
}) {
  return (
    <Card className="border-2 border-border rounded-none shadow-none">
      <CardContent className="p-4 flex gap-4">
        <UserPill initials={initials} tone="primary" />
        <div className="flex-1 flex flex-col items-end gap-3">
          <textarea
            className="w-full border-2 border-border p-3 focus:border-primary focus:outline-none transition-colors rounded-none placeholder:text-muted-foreground"
            rows={2}
            placeholder={placeholder}
          />
          <Button className="rounded-none gap-2 px-6">
            <Send className="w-4 h-4" />
            Post Comment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
