import { Queue } from "bullmq";
import connection from "../config/bullmq.config";
import { thumbnailUploadJobPayload } from "../interfaces/common/Files";

export const thumbnailUploadQueueName = "thumbnailUploadQueue";

const thumbnailUploadQueue = new Queue<thumbnailUploadJobPayload>(thumbnailUploadQueueName, {
  connection,
  defaultJobOptions: {
    removeOnComplete: {
      age: 60 * 60,
      count: 200,
    },
    removeOnFail: {
      age: 24 * 60 * 60,
      count: 500,
    },
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  },
});

export default thumbnailUploadQueue;
