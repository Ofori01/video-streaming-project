import { VideoEntity } from "../entities/VideoEntity";
import { IVideoRepository } from "../interfaces/repositories/IVideoRepository";
import { GenericRepository } from "./GenericRepository";



export class VideoRepository extends GenericRepository<VideoEntity> implements IVideoRepository {
    constructor(){
        super(VideoEntity)
    }
    
}