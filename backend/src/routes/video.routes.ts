import { VideoRepository } from "./../repositories/VideoRepository";
import { Router } from "express";
import authMiddleware from "../middlewares/auth/auth.middleware";
import { VideoController } from "../controllers/video/video.controller";
import { VideoService } from "../services/VideoService";
import { USER_ROLE } from "../lib/types/common/enums";
import { fileHandler } from "../middlewares/fileHandler/fileHandler";
import { validate } from "../middlewares/validation/validation";
import {
  CreateVideoSchema,
  GetVideoSchema,
} from "../interfaces/dtos/video-dtos";
import S3StorageService from "../services/StorageService";

const videoRoutes = Router();

const videoRepository = new VideoRepository();
const s3Service = new S3StorageService();
const videoService = new VideoService(videoRepository, s3Service);
const videoController = new VideoController(videoService);

// videoRoutes.use(authMiddleware.authenticate);
/**
 * @swagger
 * /video:
 *   post:
 *     summary: Create a new video
 *     description: Admin-only. Upload a video file and metadata.
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateVideoInput'
 *     responses:
 *       201:
 *         description: Video created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VideoResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
videoRoutes.post(
  "",
  authMiddleware.authorize(USER_ROLE.ADMIN),
  fileHandler,
  validate(CreateVideoSchema),
  videoController.CreateVideo
);

/**
 * @swagger
 * /video:
 *   get:
 *     summary: Get all videos
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of videos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VideosListResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
videoRoutes.get("", videoController.GetAllVideos);

/**
 * @swagger
 * /video/{id}:
 *   get:
 *     summary: Get a video by ID
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric video ID
 *         schema:
 *           type: integer
 *           example: 12
 *     responses:
 *       200:
 *         description: Video details
 *         content:
 *           "application/json":
 *             schema:
 *               $ref: '#/components/schemas/VideoResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
videoRoutes.get("/:id", validate(GetVideoSchema), videoController.GetVideoById);

export default videoRoutes;
