import { CreateVideoDto } from "../../interfaces/dtos/video-dtos";
import { IVideoService } from "../../interfaces/services/IVideoService";
import { AuthRequest } from "../../middlewares/auth/AuthRequest";
import { NextFunction, Response } from "express";
import responseHandler from "../../middlewares/responseHandler/responseHandler";


export class VideoController {
    constructor(private _videoService: IVideoService){}


    CreateVideo = async (req: AuthRequest<{}, {}, CreateVideoDto>, res: Response, next: NextFunction)=> {
        try {
            req.body.uploadedByUserId = req.user?.id
            const video = await this._videoService.CreateVideo(req.body)
            return responseHandler.created(res, video,"Video created successfully")

        } catch (error) {
            return next(error)
            
        }
    }

}