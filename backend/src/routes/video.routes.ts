import { VideoRepository } from "./../repositories/VideoRepository";
import { Router } from "express";
import authMiddleware from "../middlewares/auth/auth.middleware";
import { VideoController } from "../controllers/video/video.controller";
import { VideoService } from "../services/VideoService";
import { USER_ROLE } from "../lib/types/common/enums";

const videoRoutes = Router();

const videoRepository = new VideoRepository();
const videoService = new VideoService(videoRepository);
const videoController = new VideoController(videoService);

videoRoutes.use(authMiddleware.authenticate);

videoRoutes.post(
  "",
  authMiddleware.authorize(USER_ROLE.ADMIN),
  videoController.CreateVideo
);
videoRoutes.get('', authMiddleware.authorize(USER_ROLE.ADMIN), videoController.GetAllVideos)

export default videoRoutes;
