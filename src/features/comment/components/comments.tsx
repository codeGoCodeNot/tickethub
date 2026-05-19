import getComments from "../queries/get-comments";
import Image from "next/image";
import CommentItem from "./comment-item";

type CommentsProps = {
  ticketId: string;
};

const Comments = async ({ ticketId }: CommentsProps) => {
  const comments = await getComments(ticketId);

  return (
    <div className="flex flex-col flex-1 gap-y-4">
      {comments.map((comment) => (
        <CommentItem comment={comment} key={comment.id} />
      ))}
    </div>
  );
};

export default Comments;
