import { FileEntity } from "../entities/FilesEntity";
import { IFileRepository } from "../interfaces/repositories/IFileRepository";
import { GenericRepository } from "./GenericRepository";

export class FileRepository
  extends GenericRepository<FileEntity>
  implements IFileRepository
{
  constructor() {
    super(FileEntity);
  }
}
