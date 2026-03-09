import commentService, { type CommentsPage } from "@/backend/comment.service";
import type { IComment } from "@/types/Comments";
import type { ApiErrorResponse } from "@/types/errors";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

export const commentKeys = {
  all: ["comments"] as const,
  lists: () => [...commentKeys.all, "lists"] as const,
  list: (videoId: number, page: number) =>
    [...commentKeys.lists(), videoId, page] as const,
  replies: (commentId: number) =>
    [...commentKeys.all, "replies", commentId] as const,
};

export const useGetVideoComments = (
  videoId: number,
  page: number = 1,
  limit: number = 10,
  options?: Omit<
    UseQueryOptions<CommentsPage, ApiErrorResponse>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<CommentsPage, ApiErrorResponse>({
    queryKey: commentKeys.list(videoId, page),
    queryFn: () => commentService.getVideoComments(videoId, page, limit),
    enabled: !!videoId && videoId > 0,
    ...options,
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
