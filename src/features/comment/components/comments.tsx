"use client";

import CardCompact from "@/components/card-compact";
import { User } from "@/generated/prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
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
  attachments?: Record<string, React.ReactNode>;
};

const Comments = ({
  ticketId,
  user,
  initialComments,
  attachments,
}: CommentsProps) => {
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
        className={`flex flex-col flex-1 gap-y-4 animate-fade-from-top transition-opacity duration-300 ${isFetching ? "opacity-50" : "opacity-100"}`}
      >
        <AnimatePresence initial={false}>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: -40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -60, scale: 0.95 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <CommentItem
                comment={comment}
                user={user}
                onSuccess={handleInvalidateComments}
                attachments={attachments?.[comment.id]}
              />
            </motion.div>
          ))}
        </AnimatePresence>
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
