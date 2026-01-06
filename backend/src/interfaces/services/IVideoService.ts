import { VideoEntity } from "../../entities/VideoEntity";
import { UploadFiles } from "../common/Files";
import { CreateVideoDto } from "../dtos/video-dtos";
import { IGenericService } from "./IGenericService";

export interface IVideoService extends IGenericService<VideoEntity> {
  CreateVideo(
    dto: CreateVideoDto,
    files: UploadFiles,
    user: number
  ): Promise<VideoEntity>;
}
