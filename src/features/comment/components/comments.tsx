import CardCompact from "@/components/card-compact";
import { User } from "@/generated/prisma/client";
import getComments from "../queries/get-comments";
import CommentCreateForm from "./comment-create-form";
import CommentItem from "./comment-item";

type CommentsProps = {
  ticketId: string;
  user: User | null;
};

const Comments = async ({ ticketId, user }: CommentsProps) => {
  const comments = await getComments(ticketId);

  return (
    <>
      <CardCompact
        title="Create Comment"
        description="A new comment will be created"
        content={<CommentCreateForm ticketId={ticketId} />}
      />
      <div className="flex flex-col flex-1 gap-y-4">
        {comments.map((comment) => (
          <CommentItem comment={comment} key={comment.id} user={user} />
        ))}
      </div>
    </>
  );
};

export default Comments;
