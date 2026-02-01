import { Queue } from "bullmq";
import connection from "../config/bullmq.config";
import { thumbnailUploadJobPayload } from "../interfaces/common/Files";

export const thumbnailUploadQueueName = "thumbnailUploadQueue";

const thumbnailUploadQueue = new Queue<thumbnailUploadJobPayload>(thumbnailUploadQueueName, {
  connection,
});

export default thumbnailUploadQueue;
