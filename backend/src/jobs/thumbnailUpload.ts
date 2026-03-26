import { Worker, Job } from "bullmq";
import { thumbnailUploadJobPayload } from "../interfaces/common/Files";
import { thumbnailUploadQueueName } from "../worker/thumbnailUploadQueue";
import S3StorageService from "../services/StorageService";
import { FileRepository } from "../repositories/FileRepository";
import { FileEntity } from "../entities/FilesEntity";
import { FILE_TYPE } from "../lib/types/common/enums";
import { VideoRepository } from "../repositories/VideoRepository";
import connection from "../config/bullmq.config";

const thumbnailUploadWorker = new Worker<thumbnailUploadJobPayload>(
  thumbnailUploadQueueName,
  async (job: Job<thumbnailUploadJobPayload>) => {
    const { sourceKey, key, createdAt, mimeType, videoId } = job.data;

    try {
      const storageService = new S3StorageService();
      console.log("Uploading thumbnail in job");
      const thumbnail = await storageService.upload({
        body: await storageService.getObjectBuffer(sourceKey),
        key: key,
        contentType: mimeType,
        metaData: {
          createdAt: createdAt,
        },
      });

      const fileRepo = new FileRepository();
      const videoRepo = new VideoRepository();

      const thumbnailFile = new FileEntity();
      thumbnailFile.type = FILE_TYPE.THUMBNAIL;
      thumbnailFile.url = thumbnail.url;

      const savedFile = await fileRepo.Create(thumbnailFile);

      const savedVideo = await videoRepo.GetById(videoId);
      savedVideo.thumbnail = savedFile;

      console.log("thumbnail Worker", savedVideo);

      await videoRepo.Update(videoId, savedVideo);
      await storageService.deleteObject(sourceKey);
    } catch (error) {
      console.error(error);
    }
  },
  { connection },
);

export default thumbnailUploadWorker;
