import { Worker, Job } from "bullmq";
import { videoUploadJobPayload } from "../interfaces/common/Files";
import S3StorageService from "../services/StorageService";
import { videoUploadQueueName } from "../worker/videoUploadQueue";
import { FileRepository } from "../repositories/FileRepository";
import { FileEntity } from "../entities/FilesEntity";
import { FILE_TYPE } from "../lib/types/common/enums";
import { VideoRepository } from "../repositories/VideoRepository";
import connection from "../config/bullmq.config";
import SseManager from "../lib/sse/SseManager";

const videoUploadWorker = new Worker<videoUploadJobPayload>(
  videoUploadQueueName,
  async (job: Job<videoUploadJobPayload>) => {
    const { mimeType, createdAt, videoBuffer, key, videoId } = job.data;
    const videoIdStr = String(videoId);

    try {
      await new Promise((resolve) => setTimeout(resolve, 20000));

      const storageService = new S3StorageService();
      console.log("Uploading video in job");

      const video = await storageService.upload({
        body: Buffer.from(videoBuffer, "base64"),
        key: key,
        contentType: mimeType,
        metaData: {
          createdAt: createdAt,
        },
        onProgress: (loaded, total) => {
          const percent = Math.round((loaded / total) * 100);
          SseManager.sendToClient(videoIdStr, "upload-progress", {
            percent,
            loaded,
            total,
          });
        },
      });

      const fileRepo = new FileRepository();
      const videoRepo = new VideoRepository();

      const videoFile = new FileEntity();
      videoFile.url = video.url;
      videoFile.type = FILE_TYPE.VIDEO;

      const savedVideoFile = await fileRepo.Create(videoFile);

      // Find video and update
      const savedVideo = await videoRepo.GetById(videoId);
      savedVideo.video = savedVideoFile;
      await videoRepo.Update(videoId, savedVideo);

      // Notify the client that the upload is fully complete
      SseManager.sendToClient(videoIdStr, "upload-complete", { percent: 100 });
    } catch (error) {
      console.error("[videoUploadWorker] Error:", error);
      SseManager.sendToClient(videoIdStr, "upload-error", {
        message: "Video upload failed",
      });
    }
  },
  {
    connection,
  },
);

export default videoUploadWorker;

