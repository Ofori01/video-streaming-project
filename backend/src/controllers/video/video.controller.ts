import {
  CreateUploadSessionDto,
  CreateVideoDto,
  GetAllVideosQuery,
  GetVideoQueryDto,
} from "../../interfaces/dtos/video-dtos";
import { IVideoService } from "../../interfaces/services/IVideoService";
import { AuthRequest } from "../../middlewares/auth/AuthRequest";
import { NextFunction, Response } from "express";
import responseHandler from "../../middlewares/responseHandler/responseHandler";
import {
  UPLOAD_STATUS,
  VIDEO_STATUS,
} from "../../lib/types/common/enums";
import { FindOptionsWhere } from "typeorm";
import { VideoEntity } from "../../entities/VideoEntity";
import { AppDataSource } from "../../config/db.config";
import { UserEntity } from "../../entities/UserEntity";
import { CategoryEntity } from "../../entities/CategoryEntity";

export class VideoController {
  constructor(private _videoService: IVideoService) {}

  private buildCategoryFilter(categoryId?: string): FindOptionsWhere<VideoEntity> {
    if (!categoryId) {
      return {};
    }

    return {
      category: {
        id: Number(categoryId),
      },
    };
  }

  CreateUploadSession = async (
    req: AuthRequest<{}, {}, CreateUploadSessionDto>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const uploadSession = await this._videoService.CreateUploadSession(
        req.body,
        req.user?.id!,
      );
      return responseHandler.created(
        res,
        uploadSession,
        "Upload session created successfully",
      );
    } catch (error) {
      return next(error);
    }
  };

  CreateVideo = async (
    req: AuthRequest<{}, {}, CreateVideoDto>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const video = await this._videoService.CreateVideo(req.body, req.user?.id!);
      return responseHandler.created(res, video, "Video created successfully");
    } catch (error) {
      return next(error);
    }
  };

  //   GetAllVideosAdmin = async (
  //     req: AuthRequest,
  //     res: Response,
  //     next: NextFunction
  //   ) => {
  //     try {
  //       const videos = await this._videoService.GetAll({

  //         relations: {
  //           files: true,
  //           uploadedBy: true,
  //           category:true
  //         },
  //       });
  //       return responseHandler.success(res, videos);
  //     } catch (error) {
  //       return next(error);
  //     }
  //   };

  GetAllVideos = async (
    req: AuthRequest<{}, {}, {}, GetAllVideosQuery>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const categoryFilter = this.buildCategoryFilter(req.query.categoryId);

      const videos = await this._videoService.GetAll({
        where: {
          status: VIDEO_STATUS.ACTIVE,
          processingStatus: UPLOAD_STATUS.COMPLETED,
          ...categoryFilter,
        },
        order: {
          createdAt: "DESC",
        },
        relations: {
          uploadedBy: true,
          category: true,
          thumbnail: true,
          video: true,
        },
        select: {
          uploadedBy: {
            password: false,
            username: true,
            id: true,
          },
        },
      });

      return responseHandler.success(res, videos);
    } catch (error) {
      return next(error);
    }
  };

  GetAllVideosAdmin = async (
    req: AuthRequest<{}, {}, {}, GetAllVideosQuery>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const adminFilter: FindOptionsWhere<VideoEntity> = {};
      if (req.query.adminVideos && req.user?.id) {
        adminFilter.uploadedBy = {
          id: req.user.id,
        };
      }

      const categoryFilter = this.buildCategoryFilter(req.query.categoryId);

      const videos = await this._videoService.GetAll({
        where: {
          ...adminFilter,
          ...categoryFilter,
        },
        order: {
          createdAt: "DESC",
        },
        relations: {
          uploadedBy: true,
          category: true,
          thumbnail: true,
          video: true,
        },
        select: {
          uploadedBy: {
            password: false,
            username: true,
            id: true,
          },
        },
      });

      return responseHandler.success(res, videos);
    } catch (error) {
      return next(error);
    }
  };

  GetVideoById = async (
    req: AuthRequest<GetVideoQueryDto>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const video = await this._videoService.GetById(req.params.id, {
        relations: {
          category: true,
          uploadedBy: true,
          thumbnail: true,
          video: true,
        },
      });
      return responseHandler.success(res, video);
    } catch (error) {
      return next(error);
    }
  };

  DeleteVideo = async (
    req: AuthRequest<GetVideoQueryDto>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await this._videoService.DeleteVideo(req.params.id);
      return responseHandler.deleted(res, "Video marked for deletion");
    } catch (error) {
      return next(error);
    }
  };

  GetDashboardStats = async (
    _req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const videoRepo = AppDataSource.getRepository(VideoEntity);
      const userRepo = AppDataSource.getRepository(UserEntity);
      const categoryRepo = AppDataSource.getRepository(CategoryEntity);

      const [
        totalVideos,
        pendingVideos,
        processingVideos,
        completedVideos,
        failedVideos,
        totalUsers,
        totalCategories,
        recentVideos,
      ] = await Promise.all([
        videoRepo.count(),
        videoRepo.count({ where: { processingStatus: UPLOAD_STATUS.PENDING } }),
        videoRepo.count({
          where: { processingStatus: UPLOAD_STATUS.PROCESSING },
        }),
        videoRepo.count({
          where: { processingStatus: UPLOAD_STATUS.COMPLETED },
        }),
        videoRepo.count({ where: { processingStatus: UPLOAD_STATUS.FAILED } }),
        userRepo.count(),
        categoryRepo.count(),
        videoRepo.find({
          order: { createdAt: "DESC" },
          take: 6,
          relations: { uploadedBy: true, thumbnail: true, category: true },
          select: {
            id: true,
            title: true,
            processingStatus: true,
            status: true,
            createdAt: true,
            uploadedBy: { id: true, username: true },
            category: { id: true, name: true },
          },
        }),
      ]);

      return responseHandler.success(res, {
        videos: {
          total: totalVideos,
          pending: pendingVideos,
          processing: processingVideos,
          completed: completedVideos,
          failed: failedVideos,
        },
        users: { total: totalUsers },
        categories: { total: totalCategories },
        recentVideos,
      });
    } catch (error) {
      return next(error);
    }
  };
}
