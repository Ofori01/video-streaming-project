import { NextFunction, Response } from "express";
import { AuthRequest } from "../middlewares/auth/AuthRequest";
import {
  CommentParamsDto,
  CreateVideoCommentBodyDto,
  CreateVideoCommentParamDto,
  GetCommentsQueryDto,
  UpdateCommentBodyDto,
} from "../interfaces/dtos/comment-dto";
import { ICommentService } from "../interfaces/services/ICommentService";
import responseHandler from "../middlewares/responseHandler/responseHandler";

export class CommentController {
  constructor(private _commentService: ICommentService) {}

  createComment = async (
    req: AuthRequest<CreateVideoCommentParamDto, {}, CreateVideoCommentBodyDto>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const savedComment = await this._commentService.CreateComment(
        req.body,
        req.params.videoId,
        req.user?.id!,
      );
      return responseHandler.created(
        res,
        savedComment,
        "Comment created Successfully",
      );
    } catch (error) {
      return next(error);
    }
  };

  getVideoComments = async (
    req: AuthRequest<CreateVideoCommentParamDto, {}, {}, GetCommentsQueryDto>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const { comments, total } = await this._commentService.GetVideoComments(
        req.params.videoId,
        page,
        limit,
      );
      return responseHandler.successWithPagination(
        res,
        comments,
        {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit,
        },
        "Comments retrieved successfully",
      );
    } catch (error) {
      return next(error);
    }
  };

  getCommentReplies = async (
    req: AuthRequest<CommentParamsDto>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const replies = await this._commentService.GetCommentReplies(
        req.params.commentId,
      );
      return responseHandler.success(
        res,
        replies,
        "Replies retrieved successfully",
      );
    } catch (error) {
      return next(error);
    }
  };

  updateComment = async (
    req: AuthRequest<CommentParamsDto, {}, UpdateCommentBodyDto>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const updatedComment = await this._commentService.UpdateComment(
        req.params.commentId,
        req.user?.id!,
        req.body.content,
      );
      return responseHandler.updated(
        res,
        updatedComment,
        "Comment updated successfully",
      );
    } catch (error) {
      return next(error);
    }
  };

  deleteComment = async (
    req: AuthRequest<CommentParamsDto>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await this._commentService.DeleteComment(
        req.params.commentId,
        req.user?.id!,
        req.user?.role!,
      );
      return responseHandler.deleted(res, "Comment deleted successfully");
    } catch (error) {
      return next(error);
    }
  };
}
