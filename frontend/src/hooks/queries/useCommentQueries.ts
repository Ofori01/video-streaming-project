import commentService, { type CommentsPage } from "@/backend/comment.service";
import type { IComment } from "@/types/Comments";
import type { ApiErrorResponse } from "@/types/errors";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const commentKeys = {
  all: ["comments"] as const,
  infinite: (videoId: number) =>
    [...commentKeys.all, "infinite", videoId] as const,
  replies: (commentId: number) =>
    [...commentKeys.all, "replies", commentId] as const,
};

export const useGetVideoComments = (videoId: number, limit: number = 10) => {
  return useInfiniteQuery<CommentsPage, ApiErrorResponse>({
    queryKey: commentKeys.infinite(videoId),
    queryFn: ({ pageParam }) =>
      commentService.getVideoComments(videoId, pageParam as number, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.pagination;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    enabled: !!videoId && videoId > 0,
  });
};

export const useGetCommentReplies = (
  videoId: number,
  commentId: number,
  enabled: boolean = false,
) => {
  return useQuery<IComment[], ApiErrorResponse>({
    queryKey: commentKeys.replies(commentId),
    queryFn: () => commentService.getCommentReplies(videoId, commentId),
    enabled: enabled && !!commentId && commentId > 0,
  });
};
