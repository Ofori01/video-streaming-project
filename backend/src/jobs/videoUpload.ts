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
import { applyFastStart } from "../lib/ffmpeg/fastStartProcessor";

const videoUploadWorker = new Worker<videoUploadJobPayload>(
  videoUploadQueueName,
  async (job: Job<videoUploadJobPayload>) => {
    const { mimeType, createdAt, sourceKey, key, videoId } = job.data;
    const videoIdStr = String(videoId);

    try {
      const storageService = new S3StorageService();
      console.log("Uploading video in job");

      SseManager.sendToClient(videoIdStr, "upload-stage", {
        stage: "queued",
        message: "Worker picked up your video",
        percent: 5,
      });

      // Apply faststart optimization (moov atom at front)
      SseManager.sendToClient(videoIdStr, "upload-stage", {
        stage: "downloading",
        message: "Fetching source video",
        percent: 15,
      });
      let videoBufferToUpload = await storageService.getObjectBuffer(sourceKey);

      if (mimeType === "video/mp4" || key.endsWith(".mp4")) {
        SseManager.sendToClient(videoIdStr, "upload-stage", {
          stage: "optimizing",
          message: "Optimizing video for streaming",
          percent: 35,
        });
        videoBufferToUpload = await applyFastStart(videoBufferToUpload, key);
      }

      SseManager.sendToClient(videoIdStr, "upload-stage", {
        stage: "uploading",
        message: "Uploading optimized video",
        percent: 70,
      });



      const video = await storageService.upload({
        body: videoBufferToUpload,
        key: key,
        contentType: mimeType,
        metaData: {
          createdAt: createdAt,
        },
        onProgress: (loaded, total) => {
          const ratio = total > 0 ? loaded / total : 0;
          // Reserve the first 70% for preprocessing stages and map transfer to 70..95.
          const percent = Math.min(95, Math.round(70 + ratio * 25));
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

      SseManager.sendToClient(videoIdStr, "upload-stage", {
        stage: "finalizing",
        message: "Finalizing video metadata",
        percent: 98,
      });

      await storageService.deleteObject(sourceKey);

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
    concurrency: 1,
    lockDuration: 5 * 60 * 1000,
    maxStalledCount: 2,
  },
);

export default videoUploadWorker;
