import { Queue, Worker } from "bullmq";
import { LessThan, MoreThan } from "typeorm";
import connection from "../config/bullmq.config";
import { AppDataSource } from "../config/db.config";
import { UploadSessionEntity } from "../entities/UploadSessionEntity";
import { FileEntity } from "../entities/FilesEntity";
import { UPLOAD_SESSION_STATUS } from "../lib/types/common/enums";
import S3StorageService from "../services/StorageService";
import envConfig from "../config/env.config";

const uploadSessionCleanupQueueName = "uploadSessionCleanupQueue";
const uploadSessionCleanupJobName = "daily-upload-session-cleanup";

export const cleanupQueue = new Queue(uploadSessionCleanupQueueName, {
  connection,
});

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

const cleanupWorker = new Worker(
  uploadSessionCleanupQueueName,
  async () => {
    const sessionRepository = AppDataSource.getRepository(UploadSessionEntity);
    const fileRepository = AppDataSource.getRepository(FileEntity);
    const storageService = new S3StorageService();
    const now = new Date();

    const expiredSessions = await sessionRepository.find({
      where: {
        status: UPLOAD_SESSION_STATUS.INITIATED,
        expiresAt: LessThan(now),
      },
    });

    for (const session of expiredSessions) {
      try {
        await Promise.all([
          storageService.deleteObject(session.videoTempKey),
          storageService.deleteObject(session.thumbnailTempKey),
        ]);
      } catch (error) {
        console.error(
          "[uploadSessionCleanup] Failed deleting expired session objects",
          error,
        );
      }

      session.status = UPLOAD_SESSION_STATUS.EXPIRED;
      await sessionRepository.save(session);
    }

    const activeSessions = await sessionRepository.find({
      where: {
        status: UPLOAD_SESSION_STATUS.INITIATED,
        expiresAt: MoreThan(now),
      },
    });

    const activeTempKeys = new Set<string>();
    for (const session of activeSessions) {
      activeTempKeys.add(session.videoTempKey);
      activeTempKeys.add(session.thumbnailTempKey);
    }

    const fileEntities = await fileRepository.find();
    const persistedKeys = new Set<string>();
    for (const file of fileEntities) {
      const key = getS3KeyFromUrl(file.url);
      if (key) {
        persistedKeys.add(key);
      }
    }

    const tmpKeys = await storageService.listObjectKeys("uploads/tmp/");
    let deletedCount = 0;

    for (const key of tmpKeys) {
      if (activeTempKeys.has(key) || persistedKeys.has(key)) {
        continue;
      }

      try {
        await storageService.deleteObject(key);
        deletedCount += 1;
      } catch (error) {
        console.error(
          `[uploadSessionCleanup] Failed deleting orphan key: ${key}`,
          error,
        );
      }
    }

    return {
      expiredSessions: expiredSessions.length,
      deletedOrphans: deletedCount,
    };
  },
  {
    connection,
  },
);

void cleanupQueue.add(
  uploadSessionCleanupJobName,
  {},
  {
    repeat: {
      pattern: "0 3 * * *",
    },
    jobId: uploadSessionCleanupJobName,
  },
);

export default cleanupWorker;
