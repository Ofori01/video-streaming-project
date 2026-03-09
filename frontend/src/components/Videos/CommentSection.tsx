import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import type { RootState } from "@/store/store";
import type { IComment } from "@/types/Comments";
import { useGetVideoComments } from "@/hooks/queries/useCommentQueries";
import { useCreateComment } from "@/hooks/mutations/useCommentMutations";
import CommentItem from "./CommentItem";

interface CommentSectionProps {
  videoId: number;
}

const CommentSkeletonRow: React.FC = () => (
  <div className="flex gap-3">
    <Skeleton className="size-8 rounded-full shrink-0 opacity-20" />
    <div className="flex flex-col gap-2 flex-1">
      <Skeleton className="h-3 w-28 opacity-20" />
      <Skeleton className="h-3 w-full opacity-20" />
      <Skeleton className="h-3 w-3/4 opacity-20" />
    </div>
  </div>
);

const CommentSection: React.FC<CommentSectionProps> = ({ videoId }) => {
  const { isAuthenticated, userId, username } = useSelector(
    (state: RootState) => state.auth,
  );

  const [page, setPage] = useState(1);
  const [allComments, setAllComments] = useState<IComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const prevDataRef = useRef<IComment[] | undefined>(undefined);

  const { data, isPending } = useGetVideoComments(videoId, page);

  useEffect(() => {
    if (!data) return;
    const incoming = data.comments;
    if (page === 1) {
      setAllComments(incoming);
    } else if (incoming !== prevDataRef.current) {
      setAllComments((prev) => {
        const existingIds = new Set(prev.map((c) => c.id));
        return [...prev, ...incoming.filter((c) => !existingIds.has(c.id))];
      });
    }
    prevDataRef.current = incoming;
  }, [data, page]);

  const { mutate: createComment, isPending: submitting } =
    useCreateComment(videoId);

  const handleSubmit = () => {
    const trimmed = newComment.trim();
    if (!trimmed) return;
    createComment(
      { content: trimmed },
      {
        onSuccess: () => {
          setNewComment("");
          setInputFocused(false);
          setPage(1);
        },
      },
    );
  };

  const totalPages = data?.pagination?.totalPages ?? 1;
  const totalItems = data?.pagination?.totalItems ?? 0;
  const canLoadMore = page < totalPages;

  return (
    <div className="mt-5 p-4 rounded-lg bg-gray-400/20 backdrop-blur-2xl">
      {/* Heading */}
      <h3 className="font-body font-semibold text-base mb-4">
        Comments{totalItems > 0 ? ` (${totalItems})` : ""}
      </h3>

      {/* New comment input */}
      {isAuthenticated ? (
        <div className="flex gap-3 mb-4">
          <Avatar className="size-8 shrink-0 mt-0.5">
            <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium uppercase">
              {username?.charAt(0) ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2 flex-1">
            <Textarea
              placeholder="Add a comment…"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onFocus={() => setInputFocused(true)}
              className="text-sm min-h-10 bg-background/40 resize-none border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-foreground px-0 transition-all"
            />
            {inputFocused && (
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setInputFocused(false);
                    setNewComment("");
                  }}
                  className="rounded-full text-xs"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={submitting || !newComment.trim()}
                  className="rounded-full text-xs"
                >
                  {submitting ? "Posting…" : "Comment"}
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground mb-4">
          <span className="font-medium text-foreground">Sign in</span> to leave
          a comment.
        </p>
      )}

      <Separator className="mb-4 opacity-30" />

      {/* Comments list */}
      {isPending && allComments.length === 0 ? (
        <div className="flex flex-col gap-5">
          {[1, 2, 3].map((i) => (
            <CommentSkeletonRow key={i} />
          ))}
        </div>
      ) : allComments.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {allComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              videoId={videoId}
              currentUserId={isAuthenticated ? userId : undefined}
            />
          ))}

          {/* Load more */}
          {canLoadMore && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={isPending}
              className="self-center rounded-full text-xs text-muted-foreground"
            >
              {isPending ? "Loading…" : "Load more comments"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(CommentSection);
