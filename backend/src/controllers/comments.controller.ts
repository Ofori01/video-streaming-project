import { NextFunction, Response } from "express";
import { AuthRequest } from "../middlewares/auth/AuthRequest";
import {
  CreateVideoCommentBodyDto,
  CreateVideoCommentParamDto,
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
      return responseHandler.created(res,savedComment,"Comment created Successfully")
    } catch (error) {
      return next(error)
    }
  };
}
