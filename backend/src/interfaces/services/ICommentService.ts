import { CreateVideoCommentBodyDto } from "./../dtos/comment-dto";
import { CommentEntity } from "../../entities/CommentEntity";
import { IGenericService } from "./IGenericService";

export interface ICommentService extends IGenericService<CommentEntity> {
  CreateComment(
    commentDto: CreateVideoCommentBodyDto,
    videoId: number,
    userId: number,
  ): Promise<CommentEntity>;
}
