import type { ICategory, IVideo } from "../Videos"
import type { ApiSuccessResponse } from "./genericResponse"


export type GetAllVideosDto = ApiSuccessResponse<IVideo[]>
export type GetVideoDto = ApiSuccessResponse<IVideo>
export type GetAllVideoCategories = ApiSuccessResponse<ICategory[]>