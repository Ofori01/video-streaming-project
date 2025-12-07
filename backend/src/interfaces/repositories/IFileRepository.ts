import { FileEntity } from "../../entities/FilesEntity";
import { IGenericRepository } from "./IGenericRepository";



export interface IFileRepository extends IGenericRepository<FileEntity> {
    
}