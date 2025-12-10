import { CreateVideoDto, GetAllVideosQuery } from "../../interfaces/dtos/video-dtos";
import { IVideoService } from "../../interfaces/services/IVideoService";
import { AuthRequest } from "../../middlewares/auth/AuthRequest";
import { NextFunction, Response } from "express";
import responseHandler from "../../middlewares/responseHandler/responseHandler";
import { VIDEO_STATUS } from "../../lib/types/common/enums";

export class VideoController {
  constructor(private _videoService: IVideoService) {}

  CreateVideo = async (
    req: AuthRequest<{}, {}, CreateVideoDto>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      req.body.uploadedByUserId = req.user?.id;
      const video = await this._videoService.CreateVideo(req.body);
      return responseHandler.created(res, video, "Video created successfully");
    } catch (error) {
      return next(error);
    }
  };

  GetAllVideosAdmin = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const videos = await this._videoService.GetAll({
        
        relations: {
          files: true,
          uploadedBy: true,
          category:true
        },
      });
      return responseHandler.success(res, videos);
    } catch (error) {
      return next(error);
    }
  };

  GetAllVideosUser  =  async (req: AuthRequest<{},{}, {}, GetAllVideosQuery>, res: Response, next: NextFunction) => {
    try {
        const videos = await this._videoService.GetAll({
            where: {
                status: VIDEO_STATUS.ACTIVE,
                category : {
                    id : req.query.categoryId
                }
            },
            order: {
                createdAt: "DESC"
            },
            relations: {
                uploadedBy: true,
                files: true,
                category: true
            },
            select: {
                uploadedBy: {
                    password: false,
                    username: true,
                    id: true
                }
            }
        })

        return responseHandler.success(res, videos)
    } catch (error) {
        return next(error)
        
    }

  }
}
