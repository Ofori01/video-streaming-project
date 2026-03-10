import { AppDataSource } from "../config/db.config";
import { CommentEntity } from "../entities/CommentEntity";
import { UserEntity } from "../entities/UserEntity";
import { VideoEntity } from "../entities/VideoEntity";
import { CreateVideoCommentBodyDto } from "../interfaces/dtos/comment-dto";
import { ICommentsRepository } from "../interfaces/repositories/ICommentsRepository";
import { ICommentService } from "../interfaces/services/ICommentService";
import { USER_ROLE } from "../lib/types/common/enums";
import { ForbiddenError } from "../middlewares/errorHandler/errors/ForbiddenError";
import { NotFoundError } from "../middlewares/errorHandler/errors/NotFoundError";
import { UnauthorizedError } from "../middlewares/errorHandler/errors/UnauthorizedError";
import { GenericService } from "./GenericService";

export class CommentService
  extends GenericService<CommentEntity>
  implements ICommentService
{
  constructor(protected commentRepository: ICommentsRepository) {
    super(commentRepository);
  }

  CreateComment = async (
    commentDto: CreateVideoCommentBodyDto,
    videoId: number,
    userId: number,
  ) => {
    return AppDataSource.transaction(async (transactionManager) => {
      const user = await transactionManager.getRepository(UserEntity).findOne({
        where: {
          id: userId,
        },
      });
      if (!user) {
        throw new UnauthorizedError("User not found. Please login again");
      }

      const video = await transactionManager
        .getRepository(VideoEntity)
        .findOne({
          where: {
            id: videoId,
          },
        });

      if (!video) {
        throw new NotFoundError("Video not found");
      }

      const commentRepo = transactionManager.getRepository(CommentEntity);

      const comment = new CommentEntity();
      comment.content = commentDto.content;
      comment.createdBy = user;
      comment.video = video;

      if (commentDto.parentId) {
        const parentComment = await commentRepo.findOne({
          where: { id: commentDto.parentId },
        });
        if (!parentComment) {
          throw new NotFoundError("Parent Comment for reply not found");
        }
        comment.parent = parentComment;
      }

      await commentRepo.save(comment);

      return comment;
    });
  };

  GetVideoComments = async (videoId: number, page: number, limit: number) => {
    return this.commentRepository.GetVideoComments(videoId, page, limit);
  };

  GetCommentReplies = async (commentId: number) => {
    return this.commentRepository.GetCommentReplies(commentId);
  };

  UpdateComment = async (
    commentId: number,
    userId: number,
    content: string,
  ) => {
    const comment = await this.commentRepository.GetOne({
      where: { id: commentId },
      relations: { createdBy: true },
    });
    if (!comment) {
      throw new NotFoundError("Comment not found");
    }
    if (comment.createdBy.id !== userId) {
      throw new ForbiddenError("You are not allowed to update this comment");
    }
    return this.commentRepository.UpdateCommentContent(commentId, content);
  };

  DeleteComment = async (
    commentId: number,
    userId: number,
    userRole: USER_ROLE,
  ) => {
    const comment = await this.commentRepository.GetOne({
      where: { id: commentId },
      relations: { createdBy: true },
    });
    if (!comment) {
      throw new NotFoundError("Comment not found");
    }
    if (comment.createdBy.id !== userId && userRole !== USER_ROLE.ADMIN) {
      throw new ForbiddenError("You are not allowed to delete this comment");
    }
    return this.commentRepository.Delete(commentId);
  };
}
