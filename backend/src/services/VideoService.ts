import path from "path";
import { AppDataSource } from "../config/db.config";
import { CategoryEntity } from "../entities/CategoryEntity";
import { FileEntity } from "../entities/FilesEntity";
import { UserEntity } from "../entities/UserEntity";
import { VideoEntity } from "../entities/VideoEntity";
import { UploadFiles, videoUploadJobPayload } from "../interfaces/common/Files";
import { CreateVideoDto } from "../interfaces/dtos/video-dtos";
import { IVideoRepository } from "../interfaces/repositories/IVideoRepository";
import { IVideoService } from "../interfaces/services/IVideoService";
import { FILE_TYPE, UPLOAD_STATUS } from "../lib/types/common/enums";
import { NotFoundError } from "../middlewares/errorHandler/errors/NotFoundError";
import { GenericService } from "./GenericService";
import S3StorageService from "./StorageService";
import CustomError from "../middlewares/errorHandler/errors/CustomError";
import { v4 as uuidV4 } from "uuid";
import videoUploadQueue, {
  videoUploadQueueName,
} from "../worker/videoUploadQueue";
import thumbnailUploadQueue, {
  thumbnailUploadQueueName,
} from "../worker/thumbnailUploadQueue";
import uploadFlow, { uploadFlowName } from "../jobs/mainFlow";
import { th } from "zod/v4/locales";
import { mainQueueName } from "../worker/mainQueue";

export class VideoService
  extends GenericService<VideoEntity>
  implements IVideoService
{
  constructor(
    protected videoRepository: IVideoRepository,
    protected S3Service: S3StorageService, // private _categoryRepository: ICategoryRepository
  ) {
    super(videoRepository);
  }

  async CreateVideo(
    dto: CreateVideoDto,
    files: UploadFiles,
    user: number,
  ): Promise<VideoEntity> {
    //upload video to s3
    const thumbnailFile = files.thumbnail?.[0];
    const videoFile = files.video?.[0];

    if (!thumbnailFile || !videoFile) {
      throw new CustomError("video and thumbnail files are expected", 400);
    }

    // const baseKey = `${user}/${Date.now()}`; //uuid
    const baseKey = uuidV4();

    // const [S3thumbnail, S3video] = await Promise.all([
    //   this.S3Service.upload({
    //     body: thumbnailFile.buffer,
    //     key: `thumbnail/${baseKey}${path
    //       .extname(thumbnailFile.originalname)
    //       .toLowerCase()}`,
    //     contentType: thumbnailFile.mimetype,
    //     metaData: {
    //       createdAt: Date.now().toString(),
    //     },
    //   }),

    //   this.S3Service.upload({
    //     body: videoFile.buffer,
    //     key: `video/${baseKey}${path.extname(videoFile.originalname)}`,
    //     contentType: videoFile.mimetype,
    //     metaData: {
    //       createdAt: Date.now().toString(),
    //     },
    //   }),
    // ]);

    //save video to db
    return AppDataSource.transaction(async (transactionManager) => {
      const Category = await transactionManager
        .getRepository(CategoryEntity)
        .findOne({ where: { id: dto.categoryId } });
      if (!Category) {
        throw new NotFoundError("Category not found");
      }
      const uploader = await transactionManager
        .getRepository(UserEntity)
        .findOne({ where: { id: dto.uploadedByUserId } });

      if (!uploader) {
        throw new NotFoundError("Uploaded By user not found");
      }
      const videoRepo = transactionManager.getRepository(VideoEntity);
      // const fileRepo = transactionManager.getRepository(FileEntity);

      // const thumbnail = fileRepo.create({
      //   type: FILE_TYPE.THUMBNAIL,
      //   url: S3thumbnail.url,
      // });
      // const video = fileRepo.create({
      //   type: FILE_TYPE.VIDEO,
      //   url: S3video.url,
      // });

      // await fileRepo.save([thumbnail, video]);

      const newVideo = videoRepo.create({
        title: dto.title,
        description: dto.description,
        category: Category,
        uploadedBy: uploader,
        processingStatus: UPLOAD_STATUS.PROCESSING,
        // thumbnail: thumbnail,
        // video: video,
      });
      await videoRepo.save(newVideo);

      await uploadFlow.add({
        name: uploadFlowName,
        queueName: mainQueueName,
        data: { videoId: newVideo.id },
        children: [
          // thumbnail upload
          {
            name: thumbnailUploadQueueName,
            queueName: thumbnailUploadQueueName,
            data: {
              createdAt: new Date().toDateString(),
              key: `thumbnail/${baseKey}${path
                .extname(thumbnailFile.originalname)
                .toLowerCase()}`,
              mimeType: thumbnailFile.mimetype,
              thumbnailBuffer: thumbnailFile.buffer.toString("base64"),
              videoId: newVideo.id,
            },
          },
          {
            name: videoUploadQueueName,
            queueName: videoUploadQueueName,
            data: {
              createdAt: new Date().toDateString(),
              mimeType: videoFile.mimetype,
              videoBuffer: videoFile.buffer.toString("base64"),
              key: `video/${baseKey}${path.extname(videoFile.originalname)}`,
              videoId: newVideo.id,
            },
          },
        ],
      });

      // await thumbnailUploadQueue.add("thumbnail upload", {
      //   createdAt: new Date().toDateString(),
      //   key: `thumbnail/${baseKey}${path
      //     .extname(thumbnailFile.originalname)
      //     .toLowerCase()}`,
      //   mimeType: thumbnailFile.mimetype,
      //   thumbnailBuffer: thumbnailFile.buffer.toString("base64"),
      //   videoId: newVideo.id,
      // });

      // await videoUploadQueue.add("video upload", {
      //   createdAt: new Date().toDateString(),
      //   mimeType: videoFile.mimetype,
      //   videoBuffer: videoFile.buffer.toString("base64"),
      //   key: `video/${baseKey}${path.extname(videoFile.originalname)}`,
      //   videoId: newVideo.id,
      // });

      return await videoRepo.findOneOrFail({
        where: {
          id: newVideo.id,
        },
        relations: {
          thumbnail: true,
          video: true,
          category: true,
          uploadedBy: true,
        },
        select: {
          uploadedBy: {
            password: false,
            username: true,
            id: true,
          },
        },
      });
    });
  }
}
