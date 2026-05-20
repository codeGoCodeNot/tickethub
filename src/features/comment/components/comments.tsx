"use client";

import CardCompact from "@/components/card-compact";
import { Button } from "@/components/ui/button";
import { User } from "@/generated/prisma/client";
import getCommentsApi from "../queries/get-comments-api";
import { CommentWithMetadata } from "../type";
import CommentCreateForm from "./comment-create-form";
import CommentItem from "./comment-item";
import { useEffect, useState, useTransition } from "react";

type CommentsProps = {
  comments: CommentWithMetadata[];
  ticketId: string;
  user: User | null;
};

const Comments = ({ comments, ticketId, user }: CommentsProps) => {
  const [isPending, startTransition] = useTransition();
  const [paginatedComments, setPaginatedComments] = useState<
    CommentWithMetadata[]
  >([]);
  const [hasMore, setHasMore] = useState(comments.length >= 2);

  useEffect(() => {
    setHasMore(comments.length >= 2);
  }, [comments]);

  const handleMore = async () => {
    startTransition(async () => {
      const lastComment = paginatedComments.at(-1) ?? comments.at(-1);
      const cursor = lastComment
        ? { id: lastComment.id, createdAt: lastComment.createdAt.valueOf() }
        : undefined;
      const { list: moreComments, metadata } = await getCommentsApi(
        ticketId,
        cursor,
      );

      setPaginatedComments((prev) => [...prev, ...moreComments]);
      setHasMore(metadata.hasNextPage);
    });
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
          <Button variant="ghost" onClick={handleMore} disabled={isPending}>
            {isPending ? "Loading..." : "More"}
          </Button>
        </div>
      )}
    </>
  );
};

export default Comments;
