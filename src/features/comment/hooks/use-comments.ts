import { useInfiniteQuery } from "@tanstack/react-query";
import getCommentsApi from "../queries/get-comments-api";
import { CommentWithMetadata } from "../type";
import { COMMENTS_PAGE_SIZE } from "../constants";

const useComments = (
  ticketId: string,
  initialComments: CommentWithMetadata[],
) => {
  return useInfiniteQuery({
    queryKey: ["comments", ticketId],
    queryFn: async ({ pageParam }) => getCommentsApi(ticketId, pageParam),
    initialPageParam: undefined as
      | { id: string; createdAt: number }
      | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.metadata.hasNextPage ? lastPage.metadata.cursor : undefined,
    initialData: {
      pages: [
        {
          list: initialComments,
          metadata: {
            count: initialComments.length,
            hasNextPage: initialComments.length === COMMENTS_PAGE_SIZE,
            cursor: initialComments.at(-1)
              ? {
                  id: initialComments.at(-1)!.id,
                  createdAt: initialComments.at(-1)!.createdAt.valueOf(),
                }
              : undefined,
          },
        },
      ],
      pageParams: [undefined],
    },
  });
};

export default useComments;
