import getComments from "../queries/get-comments";
import Image from "next/image";
import CommentItem from "./comment-item";
import CardCompact from "@/components/card-compact";
import CommentCreateForm from "./comment-create-form";

type CommentsProps = {
  ticketId: string;
};

const Comments = async ({ ticketId }: CommentsProps) => {
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
          <CommentItem comment={comment} key={comment.id} />
        ))}
      </div>
    </>
  );
};

export default Comments;
