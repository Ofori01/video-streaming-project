import {
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
  USER_ROLE,
  VIDEO_STATUS,
} from "../../lib/types/common/enums";
import { FindOptionsWhere } from "typeorm";
import { VideoEntity } from "../../entities/VideoEntity";
import { UploadFiles } from "../../interfaces/common/Files";

export class VideoController {
  constructor(private _videoService: IVideoService) {}

  CreateVideo = async (
    req: AuthRequest<{}, {}, CreateVideoDto>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      req.body.uploadedByUserId = req.user?.id;

      const video = await this._videoService.CreateVideo(
        req.body,
        req.files as UploadFiles,
        req.user?.id!,
      );
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
      const userFilter: FindOptionsWhere<VideoEntity> =
        req.user?.role === USER_ROLE.USER
          ? {
              status: VIDEO_STATUS.ACTIVE,
              processingStatus: UPLOAD_STATUS.COMPLETED,
            }
          : {};
      if(req.query.adminVideos){
        userFilter.uploadedBy = {
          id: req.user?.id
        }
      }
      const categoryFilter: FindOptionsWhere<VideoEntity> = req.query.categoryId? {
        category: {
          id: Number(req.query.categoryId)
        },
      }: {}

      console.log(req.query.adminVideos, typeof req.query.adminVideos)
      
      const videos = await this._videoService.GetAll({
        where: {
          ...userFilter,
          ...categoryFilter
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
}
