import { Router } from "express";
import { validate } from "../middlewares/validation/validation";
import {
  commentParamsOnlySchema,
  createVideoCommentSchema,
  getCommentsSchema,
  updateCommentSchema,
} from "../interfaces/dtos/comment-dto";
import { CommentRepository } from "../repositories/CommentRepository";
import { CommentController } from "../controllers/comments.controller";
import { CommentService } from "../services/CommentService";
import authMiddleware from "../middlewares/auth/auth.middleware";

const commentRoutes = Router();
const commentRepository = new CommentRepository();
const commentService = new CommentService(commentRepository);
const commentController = new CommentController(commentService);

// Get all top-level comments for a video (public)
commentRoutes.get(
  "/:videoId",
  validate(getCommentsSchema),
  commentController.getVideoComments,
);

// Get replies for a specific comment (public)
commentRoutes.get(
  "/:videoId/:commentId/replies",
  validate(commentParamsOnlySchema),
  commentController.getCommentReplies,
);

// Create a comment or reply (authenticated)
commentRoutes.post(
  "/:videoId",
  authMiddleware.authenticate,
  validate(createVideoCommentSchema),
  commentController.createComment,
);

// Update a comment (authenticated, owner only)
commentRoutes.patch(
  "/:videoId/:commentId",
  authMiddleware.authenticate,
  validate(updateCommentSchema),
  commentController.updateComment,
);

// Delete a comment (authenticated, owner or admin)
commentRoutes.delete(
  "/:videoId/:commentId",
  authMiddleware.authenticate,
  validate(commentParamsOnlySchema),
  commentController.deleteComment,
);

export default commentRoutes;
