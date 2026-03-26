import path from "path";
import { AppDataSource } from "../config/db.config";
import { CategoryEntity } from "../entities/CategoryEntity";
import { FileEntity } from "../entities/FilesEntity";
import { UploadSessionEntity } from "../entities/UploadSessionEntity";
import { UserEntity } from "../entities/UserEntity";
import { VideoEntity } from "../entities/VideoEntity";
import {
  CreateUploadSessionDto,
  CreateUploadSessionResponse,
  CreateVideoDto,
} from "../interfaces/dtos/video-dtos";
import { IVideoRepository } from "../interfaces/repositories/IVideoRepository";
import { IVideoService } from "../interfaces/services/IVideoService";
import {
  FILE_TYPE,
  UPLOAD_SESSION_STATUS,
  UPLOAD_STATUS,
  VIDEO_STATUS,
} from "../lib/types/common/enums";
import { NotFoundError } from "../middlewares/errorHandler/errors/NotFoundError";
import { GenericService } from "./GenericService";
import S3StorageService from "./StorageService";
import CustomError from "../middlewares/errorHandler/errors/CustomError";
import { v4 as uuidV4 } from "uuid";
import { videoUploadQueueName } from "../worker/videoUploadQueue";
import uploadFlow, { uploadFlowName } from "../jobs/mainFlow";
import { mainQueueName } from "../worker/mainQueue";

const VIDEO_ALLOWED_MIME_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
];

const THUMBNAIL_ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const MAX_VIDEO_SIZE_BYTES = 500 * 1024 * 1024;
const MAX_THUMBNAIL_SIZE_BYTES = 5 * 1024 * 1024;
const UPLOAD_SESSION_EXPIRY_SECONDS = 15 * 60;

export class VideoService
  extends GenericService<VideoEntity>
  implements IVideoService
{
  constructor(
    protected videoRepository: IVideoRepository,
    protected S3Service: S3StorageService,
  ) {
    super(videoRepository);
  }

  private assertValidFileInput(params: {
    contentType: string;
    size: number;
    allowedTypes: string[];
    maxSize: number;
    fieldName: "video" | "thumbnail";
  }) {
    if (!params.allowedTypes.includes(params.contentType)) {
      throw new CustomError(`${params.fieldName} file type is not supported`, 400);
    }

    if (params.size <= 0 || params.size > params.maxSize) {
      throw new CustomError(
        `${params.fieldName} file size is invalid or exceeds allowed limit`,
        400,
      );
    }
  }

  private getFileExtension(fileName: string): string {
    const extension = path.extname(fileName).toLowerCase();
    return extension || "";
  }

  async CreateUploadSession(
    dto: CreateUploadSessionDto,
    userId: number,
  ): Promise<CreateUploadSessionResponse> {
    this.assertValidFileInput({
      contentType: dto.video.contentType,
      size: dto.video.size,
      allowedTypes: VIDEO_ALLOWED_MIME_TYPES,
      maxSize: MAX_VIDEO_SIZE_BYTES,
      fieldName: "video",
    });

    this.assertValidFileInput({
      contentType: dto.thumbnail.contentType,
      size: dto.thumbnail.size,
      allowedTypes: THUMBNAIL_ALLOWED_MIME_TYPES,
      maxSize: MAX_THUMBNAIL_SIZE_BYTES,
      fieldName: "thumbnail",
    });

    const uploader = await AppDataSource.getRepository(UserEntity).findOne({
      where: { id: userId },
    });

    if (!uploader) {
      throw new NotFoundError("Uploaded By user not found");
    }

    const sessionKey = uuidV4();
    const videoExtension = this.getFileExtension(dto.video.fileName);
    const thumbnailExtension = this.getFileExtension(dto.thumbnail.fileName);
    const expiresAt = new Date(Date.now() + UPLOAD_SESSION_EXPIRY_SECONDS * 1000);

    const videoTempKey = `uploads/tmp/${userId}/${sessionKey}/video${videoExtension}`;
    const thumbnailTempKey = `uploads/tmp/${userId}/${sessionKey}/thumbnail${thumbnailExtension}`;
    const videoFinalKey = `video/${sessionKey}${videoExtension}`;
    const thumbnailFinalKey = `thumbnail/${sessionKey}${thumbnailExtension}`;

    const [videoPresignedPost, thumbnailPresignedPost] = await Promise.all([
      this.S3Service.createPresignedPost({
        key: videoTempKey,
        contentType: dto.video.contentType,
        maxSize: MAX_VIDEO_SIZE_BYTES,
        expiresInSeconds: UPLOAD_SESSION_EXPIRY_SECONDS,
      }),
      this.S3Service.createPresignedPost({
        key: thumbnailTempKey,
        contentType: dto.thumbnail.contentType,
        maxSize: MAX_THUMBNAIL_SIZE_BYTES,
        expiresInSeconds: UPLOAD_SESSION_EXPIRY_SECONDS,
      }),
    ]);

    const uploadSessionRepo = AppDataSource.getRepository(UploadSessionEntity);
    const uploadSession = uploadSessionRepo.create({
      user: uploader,
      status: UPLOAD_SESSION_STATUS.INITIATED,
      expiresAt,
      videoTempKey,
      thumbnailTempKey,
      videoFinalKey,
      thumbnailFinalKey,
      videoExpectedMimeType: dto.video.contentType,
      videoExpectedSize: dto.video.size.toString(),
      thumbnailExpectedMimeType: dto.thumbnail.contentType,
      thumbnailExpectedSize: dto.thumbnail.size.toString(),
    });

    const savedUploadSession = await uploadSessionRepo.save(uploadSession);

    return {
      uploadSessionId: savedUploadSession.id,
      expiresAt: savedUploadSession.expiresAt.toISOString(),
      video: videoPresignedPost,
      thumbnail: thumbnailPresignedPost,
    };
  }

  async CreateVideo(
    dto: CreateVideoDto,
    userId: number,
  ): Promise<VideoEntity> {
    const uploadSessionRepo = AppDataSource.getRepository(UploadSessionEntity);
    const uploadSession = await uploadSessionRepo.findOne({
      where: { id: dto.uploadSessionId },
      relations: {
        user: true,
      },
    });

    if (!uploadSession) {
      throw new NotFoundError("Upload session not found");
    }

    if (uploadSession.user.id !== userId) {
      throw new CustomError("You are not authorized for this upload session", 403);
    }

    if (uploadSession.status !== UPLOAD_SESSION_STATUS.INITIATED) {
      throw new CustomError("Upload session is no longer valid", 400);
    }

    if (uploadSession.expiresAt.getTime() < Date.now()) {
      uploadSession.status = UPLOAD_SESSION_STATUS.EXPIRED;
      await uploadSessionRepo.save(uploadSession);
      throw new CustomError("Upload session expired, please re-upload files", 400);
    }

    const [videoMetadata, thumbnailMetadata] = await Promise.all([
      this.S3Service.getObjectMetadata(uploadSession.videoTempKey),
      this.S3Service.getObjectMetadata(uploadSession.thumbnailTempKey),
    ]);

    if (!videoMetadata || !thumbnailMetadata) {
      throw new CustomError(
        "Uploaded file was not found. Please try uploading again",
        400,
      );
    }

    const expectedVideoSize = Number(uploadSession.videoExpectedSize);
    const expectedThumbnailSize = Number(uploadSession.thumbnailExpectedSize);

    if (
      videoMetadata.ContentLength !== expectedVideoSize ||
      thumbnailMetadata.ContentLength !== expectedThumbnailSize
    ) {
      throw new CustomError("Uploaded file size does not match expected size", 400);
    }

    if (
      videoMetadata.ContentType !== uploadSession.videoExpectedMimeType ||
      thumbnailMetadata.ContentType !== uploadSession.thumbnailExpectedMimeType
    ) {
      throw new CustomError("Uploaded file type is invalid", 400);
    }

    return AppDataSource.transaction(async (transactionManager) => {
      const Category = await transactionManager
        .getRepository(CategoryEntity)
        .findOne({ where: { id: dto.categoryId } });
      if (!Category) {
        throw new NotFoundError("Category not found");
      }
      const uploader = await transactionManager
        .getRepository(UserEntity)
        .findOne({ where: { id: userId } });

      if (!uploader) {
        throw new NotFoundError("Uploaded By user not found");
      }
      const videoRepo = transactionManager.getRepository(VideoEntity);
      const sessionRepo = transactionManager.getRepository(UploadSessionEntity);
      const fileRepo = transactionManager.getRepository(FileEntity);

      const thumbnailFile = fileRepo.create({
        type: FILE_TYPE.THUMBNAIL,
        url: this.S3Service.GetPublicUrl(uploadSession.thumbnailTempKey),
      });
      const savedThumbnailFile = await fileRepo.save(thumbnailFile);

      const newVideo = videoRepo.create({
        title: dto.title,
        description: dto.description,
        category: Category,
        uploadedBy: uploader,
        processingStatus: UPLOAD_STATUS.PROCESSING,
        thumbnail: savedThumbnailFile,
      });
      await videoRepo.save(newVideo);

      await uploadFlow.add({
        name: uploadFlowName,
        queueName: mainQueueName,
        data: { videoId: newVideo.id },
        children: [
          {
            name: videoUploadQueueName,
            queueName: videoUploadQueueName,
            data: {
              createdAt: new Date().toISOString(),
              mimeType: uploadSession.videoExpectedMimeType,
              sourceKey: uploadSession.videoTempKey,
              key: uploadSession.videoFinalKey,
              videoId: newVideo.id,
            },
          },
        ],
      });

      uploadSession.status = UPLOAD_SESSION_STATUS.FINALIZED;
      uploadSession.finalizedAt = new Date();
      uploadSession.videoUploadedAt = new Date(videoMetadata.LastModified ?? new Date());
      uploadSession.thumbnailUploadedAt = new Date(
        thumbnailMetadata.LastModified ?? new Date(),
      );
      await sessionRepo.save(uploadSession);

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

  async DeleteVideo(videoId: number): Promise<void> {
    const video = await this.videoRepository.GetById(videoId);

    if (video.status === VIDEO_STATUS.DELETED) {
      return;
    }

    video.status = VIDEO_STATUS.DELETED;
    await this.videoRepository.Update(videoId, video);
  }
}
