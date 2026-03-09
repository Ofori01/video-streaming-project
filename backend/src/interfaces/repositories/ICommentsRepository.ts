import { CommentEntity } from "../../entities/CommentEntity";
import { IGenericRepository } from "./IGenericRepository";

export interface ICommentsRepository extends IGenericRepository<CommentEntity> {}
