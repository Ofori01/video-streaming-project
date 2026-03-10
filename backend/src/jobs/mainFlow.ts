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
    // Update video status 
    const videoRepo = new VideoRepository();
    const { videoId } = job.data;
    const video = await videoRepo.GetById(videoId);

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
