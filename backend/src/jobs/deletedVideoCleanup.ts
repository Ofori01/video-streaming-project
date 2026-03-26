import { Queue, Worker } from "bullmq";
import connection from "../config/bullmq.config";
import { AppDataSource } from "../config/db.config";
import { VideoEntity } from "../entities/VideoEntity";
import { FileEntity } from "../entities/FilesEntity";
import { VIDEO_STATUS } from "../lib/types/common/enums";
import S3StorageService from "../services/StorageService";
import envConfig from "../config/env.config";

const deletedVideoCleanupQueueName = "deletedVideoCleanupQueue";
const deletedVideoCleanupJobName = "deleted-video-cleanup";

export const deletedVideoCleanupQueue = new Queue(
  deletedVideoCleanupQueueName,
  {
    connection,
  },
);

const getS3KeyFromUrl = (url: string): string | null => {
  const normalizedBaseUrls = [
    envConfig.AWS_CDN_BASE_URL,
    envConfig.AWS_BASE_URL,
  ]
    .filter(Boolean)
    .map((item) => item!.replace(/\/+$/, ""));

  for (const baseUrl of normalizedBaseUrls) {
    if (url.startsWith(baseUrl)) {
      const pathValue = url.slice(baseUrl.length).replace(/^\/+/, "");
      return pathValue || null;
    }
  }

  return null;
};

const deletedVideoCleanupWorker = new Worker(
  deletedVideoCleanupQueueName,
  async () => {
    const videoRepository = AppDataSource.getRepository(VideoEntity);
    const fileRepository = AppDataSource.getRepository(FileEntity);
    const storageService = new S3StorageService();

    const deletedVideos = await videoRepository.find({
      where: {
        status: VIDEO_STATUS.DELETED,
      },
      relations: {
        video: true,
        thumbnail: true,
      },
    });

    let deletedVideosCount = 0;
    let deletedS3ObjectsCount = 0;

    for (const video of deletedVideos) {
      const fileIdsToDelete = new Set<number>();
      const candidateUrls = [video.video?.url, video.thumbnail?.url].filter(
        (value): value is string => Boolean(value),
      );

      for (const url of candidateUrls) {
        const key = getS3KeyFromUrl(url);
        if (!key) {
          continue;
        }

        try {
          await storageService.deleteObject(key);
          deletedS3ObjectsCount += 1;
        } catch (error) {
          console.error(
            `[deletedVideoCleanup] Failed deleting S3 object key=${key}`,
            error,
          );
        }
      }

      if (video.video?.id) {
        fileIdsToDelete.add(video.video.id);
      }

      if (video.thumbnail?.id) {
        fileIdsToDelete.add(video.thumbnail.id);
      }

      await videoRepository.delete({ id: video.id });
      deletedVideosCount += 1;

      for (const fileId of fileIdsToDelete) {
        await fileRepository.delete({ id: fileId });
      }
    }

    return {
      deletedVideos: deletedVideosCount,
      deletedS3Objects: deletedS3ObjectsCount,
    };
  },
  {
    connection,
  },
);

void deletedVideoCleanupQueue.add(
  deletedVideoCleanupJobName,
  {},
  {
    repeat: {
      pattern: "*/30 * * * *",
    },
    jobId: deletedVideoCleanupJobName,
  },
);

export default deletedVideoCleanupWorker;
