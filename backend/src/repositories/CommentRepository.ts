import { IsNull } from "typeorm";
import { CommentEntity } from "../entities/CommentEntity";
import { ICommentsRepository } from "../interfaces/repositories/ICommentsRepository";
import { GenericRepository } from "./GenericRepository";

export class CommentRepository
  extends GenericRepository<CommentEntity>
  implements ICommentsRepository
{
  constructor() {
    super(CommentEntity);
  }

  async GetVideoComments(videoId: number, page: number, limit: number) {
    const [comments, total] = await this.repository.findAndCount({
      where: { video: { id: videoId }, parent: IsNull() },
      relations: { createdBy: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: "DESC" },
    });
    return { comments, total };
  }

  async GetCommentReplies(commentId: number) {
    return this.repository.find({
      where: { parent: { id: commentId } },
      relations: { createdBy: true },
      order: { createdAt: "ASC" },
    });
  }

  async UpdateCommentContent(commentId: number, content: string) {
    await this.repository.update(commentId, { content });
    return this.repository.findOneOrFail({
      where: { id: commentId },
      relations: { createdBy: true },
    });
  }
}
