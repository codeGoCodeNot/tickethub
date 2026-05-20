"use client";

import CardCompact from "@/components/card-compact";
import { Button } from "@/components/ui/button";
import { User } from "@/generated/prisma/client";
import getCommentsApi from "../queries/get-comments-api";
import { CommentWithMetadata } from "../type";
import CommentCreateForm from "./comment-create-form";
import CommentItem from "./comment-item";
import { useEffect, useState } from "react";

type CommentsProps = {
  comments: CommentWithMetadata[];
  ticketId: string;
  user: User | null;
};

const Comments = ({ comments, ticketId, user }: CommentsProps) => {
  const [paginatedComments, setPaginatedComments] = useState<
    CommentWithMetadata[]
  >([]);

  useEffect(() => {
    setHasMore(comments.length >= 2);
  }, [comments]);

  const [hasMore, setHasMore] = useState(comments.length >= 2);

  const handleMore = async () => {
    const offset = comments.length + paginatedComments.length;
    const { list: moreComments, metadata } = await getCommentsApi(
      ticketId,
      offset,
    );

    setPaginatedComments((prev) => [...prev, ...moreComments]);
    setHasMore(metadata.hasNextPage);
  };

  const handleDeleteComment = (id: string) => {
    setPaginatedComments((prev) => prev.filter((comment) => comment.id !== id));
  };

  return (
    <>
      <CardCompact
        className="max-w-[580px] w-full  self-center"
        title="Create Comment"
        description="A new comment will be created"
        content={<CommentCreateForm ticketId={ticketId} />}
      />
      <div className="flex flex-col flex-1 gap-y-4">
        {comments.map((comment) => (
          <CommentItem comment={comment} key={comment.id} user={user} />
        ))}
        {paginatedComments.map((comment) => (
          <CommentItem
            comment={comment}
            key={comment.id}
            user={user}
            onDelete={handleDeleteComment}
          />
        ))}
      </div>
      {hasMore && (
        <div className="flex flex-col justify-center ml-8">
          <Button variant="ghost" onClick={handleMore}>
            More
          </Button>
        </div>
      )}
    </>
  );
};

export default Comments;
