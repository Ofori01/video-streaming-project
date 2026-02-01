import { Queue, QueueEvents, tryCatch } from "bullmq";
import connection from "../config/bullmq.config";
import { uploadFlowName } from "../jobs/mainFlow";
import { VideoRepository } from "../repositories/VideoRepository";
import { UPLOAD_STATUS, VIDEO_STATUS } from "../lib/types/common/enums";

export const mainQueueName = "main queue";

const mainQueue = new Queue<{ videoId: number }>(mainQueueName, {
  connection,
});

//listen for completed event
// const queueEvents = new QueueEvents(mainQueueName, { connection });

// queueEvents.on("completed", async ({ jobId }) => {
//   try {
//     const job = await mainQueue.getJob(jobId);

//     if (job) {
//       //update db
//       const videoRepo = new VideoRepository();
//       const { videoId } = job.data;
//       const video = await videoRepo.GetById(videoId);
//       video.processingStatus = UPLOAD_STATUS.COMPLETED;
//       video.status = VIDEO_STATUS.ACTIVE;

//       await videoRepo.Update(videoId, video);
//     } else {
//       console.error("Job not found");
//     }
//   } catch (error) {
//     console.error("error while updating main queue", error);
//   }
// });

export default mainQueue;
