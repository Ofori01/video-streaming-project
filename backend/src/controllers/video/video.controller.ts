import { CreateVideoDto, GetAllVideosQuery } from "../../interfaces/dtos/video-dtos";
import { IVideoService } from "../../interfaces/services/IVideoService";
import { AuthRequest } from "../../middlewares/auth/AuthRequest";
import { NextFunction, Response } from "express";
import responseHandler from "../../middlewares/responseHandler/responseHandler";
import { UPLOAD_STATUS, USER_ROLE, VIDEO_STATUS } from "../../lib/types/common/enums";
import { FindOptionsWhere } from "typeorm";
import { UserEntity } from "../../entities/UserEntity";
import { VideoEntity } from "../../entities/VideoEntity";

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

  GetAllVideos =  async (req: AuthRequest<{},{}, {}, GetAllVideosQuery>, res: Response, next: NextFunction) => {
    try {

        const userFilter : FindOptionsWhere<VideoEntity> = req.user?.role === USER_ROLE.USER ? {
            status: VIDEO_STATUS.ACTIVE,
            processingStatus: UPLOAD_STATUS.COMPLETED,
            
        } : {}
        const videos = await this._videoService.GetAll({
            where: {
                ...userFilter,
                category : {
                    id : req.query.categoryId
                }
            },
            order: {
                createdAt: "DESC"
            },
            relations: {
                uploadedBy: true,
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
