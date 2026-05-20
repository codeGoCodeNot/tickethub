import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import UserAvatar from "@/components/user-avatar";
import isOwner from "@/features/auth/utils/is-owner";
import { User } from "@/generated/prisma/browser";
import { format } from "date-fns/format";
import { LucideCalendar } from "lucide-react";
import { CommentWithMetadata } from "../type";
import CommentDeleteButton from "./comment-delete-button";
import CommentTriggerButton from "./comment-trigger-button";
import CommentEditInline from "./comment-edit-inline";

type CommentItemProps = {
  comment: CommentWithMetadata;
  user: User | null;
  onDelete?: (id: string) => void;
};

const CommentItem = ({ comment, user, onDelete }: CommentItemProps) => {
  const commentIsOwner = isOwner(user, comment);

  const isEdited = comment.createdAt.getTime() !== comment.updatedAt.getTime();

  return (
    <Card className="w-full border-0 bg-card/80 shadow-sm hover:shadow-md ring-1 ring-border hover:ring-primary/50 transition-all duration-200">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-x-2 mb-2">
          <UserAvatar
            name={comment.user.name}
            image={comment.user.image}
            className="size-6 shrink-0 text-xs"
          />
          <span className="text-sm font-medium">
            {comment.user.name.split(" ")[0]}
          </span>
          <span className="ml-auto text-xs text-muted-foreground flex items-center gap-x-1">
            <LucideCalendar className="size-3" />
            {comment.createdAt
              ? format(new Date(comment.createdAt), "MMM d, yyyy")
              : "—"}
            {isEdited && " (edited)"}
          </span>
          {commentIsOwner && (
            <div className="flex gap-x-1">
              <CommentTriggerButton commentId={comment.id} />
              <CommentDeleteButton id={comment.id} onDelete={onDelete} />
            </div>
          )}
        </div>
        <Separator />
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-xs text-muted-foreground leading-relaxed mb-5">
          {comment.content}
        </p>
        <CommentEditInline commentId={comment.id} content={comment.content} />
      </CardContent>
    </Card>
  );
};

export default CommentItem;
