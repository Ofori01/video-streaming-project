import { VideoEntity } from "../../entities/VideoEntity";
import {
  CreateUploadSessionDto,
  CreateUploadSessionResponse,
  CreateVideoDto,
} from "../dtos/video-dtos";
import { IGenericService } from "./IGenericService";

export interface IVideoService extends IGenericService<VideoEntity> {
  CreateUploadSession(
    dto: CreateUploadSessionDto,
    userId: number,
  ): Promise<CreateUploadSessionResponse>;

  CreateVideo(
    dto: CreateVideoDto,
    userId: number,
  ): Promise<VideoEntity>;

  DeleteVideo(videoId: number): Promise<void>;
}
