import React, { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, ChevronUp, Pencil, Reply, Trash2 } from "lucide-react";
import type { IComment } from "@/types/Comments";
import { useGetCommentReplies } from "@/hooks/queries/useCommentQueries";
import {
  useCreateComment,
  useDeleteComment,
  useUpdateComment,
} from "@/hooks/mutations/useCommentMutations";

function relativeTime(date: Date | string): string {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}mo ago`;
  return `${Math.floor(diff / 31536000)}y ago`;
}

interface CommentItemProps {
  comment: IComment;
  videoId: number;
  currentUserId?: number;
  depth?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  videoId,
  currentUserId,
  depth = 0,
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const isOwner =
    currentUserId !== undefined && currentUserId === comment.createdBy.id;

  const { data: replies = [], isFetching: loadingReplies } =
    useGetCommentReplies(videoId, comment.id, showReplies);

  const { mutate: createComment, isPending: submittingReply } =
    useCreateComment(videoId);
  const { mutate: updateComment, isPending: savingEdit } =
    useUpdateComment(videoId);
  const { mutate: deleteComment, isPending: deleting } =
    useDeleteComment(videoId);

  const handleSubmitReply = () => {
    const trimmed = replyContent.trim();
    if (!trimmed) return;
    createComment(
      { content: trimmed, parentId: comment.id },
      {
        onSuccess: () => {
          setReplyContent("");
          setShowReplyForm(false);
          setShowReplies(true);
        },
      },
    );
  };

  const handleSaveEdit = () => {
    const trimmed = editContent.trim();
    if (!trimmed || trimmed === comment.content) {
      setIsEditing(false);
      return;
    }
    updateComment(
      { commentId: comment.id, content: trimmed },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  const handleDelete = () => {
    deleteComment(comment.id);
  };

  return (
    <div className="flex flex-row gap-3">
      {/* Avatar */}
      <div className="flex flex-col items-center gap-1 shrink-0">
        <Avatar className="size-8">
          <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium uppercase">
            {comment.createdBy.username.charAt(0)}
          </AvatarFallback>
        </Avatar>
        {/* thread line — only show when replies are expanded */}
        {showReplies && replies.length > 0 && (
          <button
            className="flex-1 w-px bg-border hover:bg-destructive/50 transition-colors cursor-pointer min-h-4"
            onClick={() => setShowReplies(false)}
            aria-label="Collapse replies"
          />
        )}
      </div>

      {/* Content column */}
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-sm font-semibold text-white leading-none">
            {comment.createdBy.username}
          </span>
          <span className="text-muted-foreground text-xs">·</span>
          <span className="text-muted-foreground text-xs">
            {relativeTime(comment.createdAt)}
          </span>
        </div>

        {/* Content / Edit form */}
        {isEditing ? (
          <div className="flex flex-col gap-2 mt-1">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="text-sm min-h-16 bg-background/50 resize-none"
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSaveEdit}
                disabled={savingEdit || !editContent.trim()}
                className="rounded-full"
              >
                {savingEdit ? "Saving…" : "Save"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(comment.content);
                }}
                className="rounded-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-50 leading-relaxed wrap-break-word">
            {comment.content}
          </p>
        )}

        {/* Action buttons */}
        {!isEditing && (
          <div className="flex items-center gap-0.5 mt-0.5 -ml-2">
            {currentUserId !== undefined && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowReplyForm((p) => !p)}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground rounded-full gap-1"
              >
                <Reply className="size-3.5" />
                Reply
              </Button>
            )}
            {isOwner && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditContent(comment.content);
                    setIsEditing(true);
                  }}
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground rounded-full gap-1"
                >
                  <Pencil className="size-3.5" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive rounded-full gap-1"
                >
                  <Trash2 className="size-3.5" />
                  Delete
                </Button>
              </>
            )}
          </div>
        )}

        {/* Reply input */}
        {showReplyForm && (
          <div className="flex flex-col gap-2 mt-1">
            <Textarea
              placeholder={`Reply to ${comment.createdBy.username}…`}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="text-sm min-h-14 bg-background/50 resize-none"
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSubmitReply}
                disabled={submittingReply || !replyContent.trim()}
                className="rounded-full"
              >
                {submittingReply ? "Posting…" : "Reply"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setShowReplyForm(false);
                  setReplyContent("");
                }}
                className="rounded-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Expand/collapse replies — dynamic at any depth */}
        <div className="mt-1">
          {loadingReplies && showReplies ? (
            <div className="flex flex-col gap-2 pl-2 border-l border-border mt-2">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-2">
                  <Skeleton className="size-7 rounded-full shrink-0 opacity-20" />
                  <div className="flex flex-col gap-1.5 flex-1">
                    <Skeleton className="h-3 w-24 opacity-20" />
                    <Skeleton className="h-3 w-3/4 opacity-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : showReplies && replies.length > 0 ? (
            <div className="flex flex-col gap-3 mt-2 pl-3 border-l-2 border-border">
              {replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  videoId={videoId}
                  currentUserId={currentUserId}
                  depth={depth + 1}
                />
              ))}
            </div>
          ) : null}

          {/* Show/hide replies toggle */}
          {!loadingReplies && (showReplies ? replies.length > 0 : true) && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowReplies((p) => !p)}
              className="mt-1 h-7 px-2 text-xs text-muted-foreground hover:text-foreground rounded-full gap-1"
            >
              {showReplies ? (
                <>
                  <ChevronUp className="size-3.5" />
                  Hide replies
                </>
              ) : (
                <>
                  <ChevronDown className="size-3.5" />
                  {replies.length > 0
                    ? `${replies.length} ${replies.length === 1 ? "reply" : "replies"}`
                    : "View replies"}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(CommentItem);
