import { Queue } from "bullmq";
import connection from "../config/bullmq.config";
import { videoUploadJobPayload } from "../interfaces/common/Files";

export const videoUploadQueueName = "videoUploadQueue";

const videoUploadQueue = new Queue<videoUploadJobPayload>(videoUploadQueueName, {
  connection,
});

export default videoUploadQueue;
