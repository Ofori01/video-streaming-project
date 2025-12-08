import { VideoEntity } from "../../entities/VideoEntity";
import { CreateVideoDto } from "../dtos/video-dtos";
import { IGenericService } from "./IGenericService";



export interface IVideoService extends IGenericService<VideoEntity> {

    CreateVideo(dto: CreateVideoDto): Promise<VideoEntity | null>
}