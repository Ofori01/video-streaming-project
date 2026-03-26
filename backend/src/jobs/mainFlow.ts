import { mainQueueName } from "./../worker/mainQueue";
import { FlowProducer, Job, Worker } from "bullmq";
import connection from "../config/bullmq.config";
import { VideoRepository } from "../repositories/VideoRepository";
import { UPLOAD_STATUS, VIDEO_STATUS } from "../lib/types/common/enums";

export const uploadFlowName = "upload video and thumbnail";
const uploadFlow = new FlowProducer({ connection });

const mainWorker = new Worker<{ videoId: number }>(
  mainQueueName,
  async (job: Job<{ videoId: number }>) => {
    // Update video status unless the admin already marked it for deletion.
    const videoRepo = new VideoRepository();
    const { videoId } = job.data;
    const video = await videoRepo.GetById(videoId);

    if (video.status === VIDEO_STATUS.DELETED) {
      console.log(`Video ${videoId} is marked deleted; skipping activation`);
      return { success: true, videoId, skipped: "deleted" };
    }

    video.processingStatus = UPLOAD_STATUS.COMPLETED;
    video.status = VIDEO_STATUS.ACTIVE;

    await videoRepo.Update(videoId, video);

    console.log(`Video ${videoId} processing completed successfully`);
    return { success: true, videoId };
  },
  {
    connection,
  },
);

export default uploadFlow;
