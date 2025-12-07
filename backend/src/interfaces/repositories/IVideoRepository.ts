import { VideoEntity } from "../../entities/VideoEntity";
import { IGenericRepository } from "./IGenericRepository";



export interface IVideoRepository extends IGenericRepository<VideoEntity> {
    
}