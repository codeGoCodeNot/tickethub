"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import UserAvatar from "@/components/user-avatar";
import { format } from "date-fns/format";
import { LucideCalendar } from "lucide-react";
import { CommentWithMetadata } from "../type";
import CommentDeleteButton from "./comment-delete-button";
import isOwner from "@/features/auth/utils/is-owner";
import { useSession } from "@/lib/auth-client";

type CommentItemProps = {
  comment: CommentWithMetadata;
};

const CommentItem = ({ comment }: CommentItemProps) => {
  const { data: session } = useSession();
  const user = session?.user;
  const commentIsOwner = isOwner(user, comment);

  return (
    <div className="flex gap-x-1">
      <Card className="w-full border-0 bg-card/80 shadow-sm hover:shadow-md ring-1 ring-border hover:ring-primary/50 transition-all duration-200">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-x-2 mb-2">
            <UserAvatar
              name={comment.user.name}
              image={comment.user.image}
              className="size-6 shrink-0 text-xs"
            />
            <span className="text-sm font-medium">{comment.user.name}</span>
            <span className="ml-auto text-xs text-muted-foreground flex items-center gap-x-1">
              <LucideCalendar className="size-3" />
              {comment.createdAt
                ? format(new Date(comment.createdAt), "MMM d, yyyy")
                : "—"}
            </span>
          </div>
          <Separator />
        </CardHeader>
        <CardContent className="pb-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {comment.content}
          </p>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-y-1">
        {commentIsOwner && <CommentDeleteButton id={comment.id} />}
      </div>
    </div>
  );
};

export default CommentItem;
