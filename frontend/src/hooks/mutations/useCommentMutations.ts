import commentService from "@/backend/comment.service";
import type { CreateCommentPayload } from "@/types/dtos/comments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentKeys } from "../queries/useCommentQueries";

export const useCreateComment = (videoId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["comment", "create", videoId],
    mutationFn: (data: CreateCommentPayload) =>
      commentService.createComment(videoId, data),
    onSuccess: (_data, variables) => {
      if (variables.parentId) {
        queryClient.invalidateQueries({
          queryKey: commentKeys.replies(variables.parentId),
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: commentKeys.infinite(videoId),
        });
      }
    },
  });
};

export const useUpdateComment = (videoId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["comment", "update", videoId],
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: number;
      content: string;
    }) => commentService.updateComment(videoId, commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.all });
    },
  });
};

export const useDeleteComment = (videoId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["comment", "delete", videoId],
    mutationFn: (commentId: number) =>
      commentService.deleteComment(videoId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.all });
    },
  });
};
