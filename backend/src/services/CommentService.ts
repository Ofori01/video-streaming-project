import { AppDataSource } from "../config/db.config";
import { CommentEntity } from "../entities/CommentEntity";
import { UserEntity } from "../entities/UserEntity";
import { VideoEntity } from "../entities/VideoEntity";
import { CreateVideoCommentBodyDto } from "../interfaces/dtos/comment-dto";
import { ICommentsRepository } from "../interfaces/repositories/ICommentsRepository";
import { ICommentService } from "../interfaces/services/ICommentService";
import { NotFoundError } from "../middlewares/errorHandler/errors/NotFoundError";
import { UnauthorizedError } from "../middlewares/errorHandler/errors/UnauthorizedError";
import { GenericService } from "./GenericService";

class CommentService
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
}
