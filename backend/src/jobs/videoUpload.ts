import { Worker, Job } from "bullmq";
import { videoUploadJobPayload } from "../interfaces/common/Files";
import S3StorageService from "../services/StorageService";
import path from "path";
import { v4 as uuidV4 } from "uuid";
import { videoUploadQueueName } from "../worker/videoUploadQueue";
import { FileRepository } from "../repositories/FileRepository";
import { FileEntity } from "../entities/FilesEntity";
import { FILE_TYPE, UPLOAD_STATUS } from "../lib/types/common/enums";
import { VideoRepository } from "../repositories/VideoRepository";
import connection from "../config/bullmq.config";

const videoUploadWorker = new Worker<videoUploadJobPayload>(
  videoUploadQueueName,
  async (job: Job<videoUploadJobPayload>) => {
    try {
      const { mimeType, createdAt, videoBuffer, key, videoId } = job.data;

      await new Promise((resolve) => setTimeout(resolve, 20000));

      const storageService = new S3StorageService();
      //make a call to the s3 service to upload the video
      console.log("Uploading video in job");

      const video = await storageService.upload({
        body: Buffer.from(videoBuffer, "base64"),
        key: key,
        contentType: mimeType,
        metaData: {
          createdAt: createdAt,
        },
      });

      const fileRepo = new FileRepository();
      const videoRepo = new VideoRepository();

      const videoFile = new FileEntity();
      videoFile.url = video.url;
      videoFile.type = FILE_TYPE.VIDEO;

      const savedVideoFile = await fileRepo.Create(videoFile);

      //find video and update
      const savedVideo = await videoRepo.GetById(videoId);
      savedVideo.video = savedVideoFile;
      // console.log("video worker",savedVideo)

      // if (savedVideo.video) {
      //   savedVideo.processingStatus = UPLOAD_STATUS.COMPLETED;
      // }
      await videoRepo.Update(videoId, savedVideo);
    } catch (error) {
      console.error(error);
    }
  },
  {
    connection,
  },
);

export default videoUploadWorker;
