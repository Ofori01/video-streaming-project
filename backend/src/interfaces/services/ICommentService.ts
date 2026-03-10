import { CreateVideoCommentBodyDto } from "./../dtos/comment-dto";
import { CommentEntity } from "../../entities/CommentEntity";
import { USER_ROLE } from "../../lib/types/common/enums";
import { IGenericService } from "./IGenericService";

export interface ICommentService extends IGenericService<CommentEntity> {
  CreateComment(
    commentDto: CreateVideoCommentBodyDto,
    videoId: number,
    userId: number,
  ): Promise<CommentEntity>;
  GetVideoComments(
    videoId: number,
    page: number,
    limit: number,
  ): Promise<{ comments: CommentEntity[]; total: number }>;
  GetCommentReplies(commentId: number): Promise<CommentEntity[]>;
  UpdateComment(
    commentId: number,
    userId: number,
    content: string,
  ): Promise<CommentEntity>;
  DeleteComment(
    commentId: number,
    userId: number,
    userRole: USER_ROLE,
  ): Promise<void>;
}
