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
}
