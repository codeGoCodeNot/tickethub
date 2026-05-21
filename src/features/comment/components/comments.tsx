"use client";

import CardCompact from "@/components/card-compact";
import { User } from "@/generated/prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import useComments from "../hooks/use-comments";
import { CommentWithMetadata } from "../type";
import CommentCreateForm from "./comment-create-form";
import CommentItem from "./comment-item";

type CommentsProps = {
  ticketId: string;
  user: User | null;
  initialComments: CommentWithMetadata[];
};

const Comments = ({ ticketId, user, initialComments }: CommentsProps) => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isFetching } =
    useComments(ticketId, initialComments);

  const queryClient = useQueryClient();
  const comments = data.pages.flatMap((page) => page.list);

  const handleInvalidateComments = () =>
    queryClient.invalidateQueries({ queryKey: ["comments", ticketId] });

  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage]);

  return (
    <>
      <CardCompact
        className="max-w-[580px] w-full  self-center"
        title="Create Comment"
        description="A new comment will be created"
        content={
          <CommentCreateForm
            ticketId={ticketId}
            onSuccess={handleInvalidateComments}
          />
        }
      />
      <div
        className={`flex flex-col flex-1 gap-y-4 transition-opacity duration-300 ${isFetching ? "opacity-50" : "opacity-100"}`}
      >
        {comments.map((comment) => (
          <CommentItem
            comment={comment}
            key={comment.id}
            user={user}
            onSuccess={handleInvalidateComments}
          />
        ))}
      </div>
      <div ref={ref}>
        {isFetchingNextPage && (
          <p className="text-right text-xs italic">Loading...</p>
        )}
        {!hasNextPage && (
          <p className="text-right text-xs italic">No more comments to load.</p>
        )}
      </div>
    </>
  );
};

export default Comments;
