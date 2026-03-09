import { CommentEntity } from "../../entities/CommentEntity";
import { IGenericRepository } from "./IGenericRepository";

export interface ICommentsRepository extends IGenericRepository<CommentEntity> {
  GetVideoComments(
    videoId: number,
    page: number,
    limit: number,
  ): Promise<{ comments: CommentEntity[]; total: number }>;
  GetCommentReplies(commentId: number): Promise<CommentEntity[]>;
  UpdateCommentContent(
    commentId: number,
    content: string,
  ): Promise<CommentEntity>;
}
