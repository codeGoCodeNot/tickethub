import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import UserAvatar from "@/components/user-avatar";
import isOwner from "@/features/auth/utils/is-owner";
import { User } from "@/generated/prisma/browser";
import { format } from "date-fns/format";
import { LucideCalendar, LucidePaperclip } from "lucide-react";
import { useCommentEditStore } from "../stores/comment-edit-store";
import { CommentWithMetadata } from "../type";
import CommentDeleteButton from "./comment-delete-button";
import CommentEditInline from "./comment-edit-inline";
import CommentTriggerButton from "./comment-trigger-button";

type CommentItemProps = {
  comment: CommentWithMetadata;
  user: User | null;
  onSuccess: () => void;
  attachments?: React.ReactNode;
};

const CommentItem = ({
  comment,
  user,
  onSuccess,
  attachments,
}: CommentItemProps) => {
  const commentIsOwner = isOwner(user, comment);
  const { editingCommentId } = useCommentEditStore();
  const isEditing = editingCommentId === comment.id;

  const isEdited = comment.createdAt.getTime() !== comment.updatedAt.getTime();

  return (
    <Card className="w-full border-0 bg-card/80 shadow-sm hover:shadow-md ring-1 ring-border hover:ring-primary/50 transition-all duration-200">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-x-2">
          <UserAvatar
            name={comment.user.name}
            image={comment.user.image}
            className="size-7 shrink-0 text-xs"
          />
          <span className="text-sm font-medium">
            {comment.user.name.split(" ")[0]}
          </span>
          {commentIsOwner && (
            <div className="flex gap-x-1 ml-auto">
              <CommentTriggerButton commentId={comment.id} />
              <CommentDeleteButton id={comment.id} onSuccess={onSuccess} />
            </div>
          )}
        </div>
        <Separator className="mt-2" />
      </CardHeader>
      <CardContent className="pb-3">
        {!isEditing && (
          <p className="text-sm text-foreground leading-relaxed">
            {comment.content}
          </p>
        )}
        <CommentEditInline
          commentId={comment.id}
          content={comment.content}
          onSuccess={onSuccess}
        />
        <div className="flex items-center justify-end gap-x-1 mt-3 text-[11px] text-muted-foreground">
          {isEdited && <span className="italic">edited ·</span>}
          <LucideCalendar className="size-3" />
          <span>
            {comment.createdAt
              ? format(new Date(comment.createdAt), "MMM d, yyyy h:mm a")
              : "—"}
          </span>
        </div>
      </CardContent>

      {attachments && (
        <>
          <Separator />
          <div className="px-6 py-3">
            <div className="flex items-center gap-x-1.5 mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              <LucidePaperclip className="size-3" />
              <span>Attachments</span>
            </div>
            {attachments}
          </div>
        </>
      )}
    </Card>
  );
};

export default CommentItem;
