import { Worker, Job, tryCatch } from "bullmq";
import { thumbnailUploadJobPayload } from "../interfaces/common/Files";
import { thumbnailUploadQueueName } from "../worker/thumbnailUploadQueue";
import S3StorageService from "../services/StorageService";
import { FileRepository } from "../repositories/FileRepository";
import { FileEntity } from "../entities/FilesEntity";
import { FILE_TYPE, UPLOAD_STATUS } from "../lib/types/common/enums";
import { VideoRepository } from "../repositories/VideoRepository";
import connection from "../config/bullmq.config";

const thumbnailUploadWorker = new Worker<thumbnailUploadJobPayload>(
  thumbnailUploadQueueName,
  async (job: Job<thumbnailUploadJobPayload>) => {
    const { thumbnailBuffer, key, createdAt, mimeType, videoId } = job.data;
    const name = job.name

    try {
      await new Promise((resolve) => setTimeout(resolve, 20000));

      const storageService = new S3StorageService();
      console.log("Uploading thumbnail in job");
      const thumbnail = await storageService.upload({
        body: Buffer.from(thumbnailBuffer, "base64"),
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

      // if (savedVideo.thumbnail) {
      //   savedVideo.processingStatus = UPLOAD_STATUS.COMPLETED;
      // }
      await videoRepo.Update(videoId, savedVideo);
    } catch (error) {
      console.error(error);
    }
  },
  { connection },
);

export default thumbnailUploadWorker;
