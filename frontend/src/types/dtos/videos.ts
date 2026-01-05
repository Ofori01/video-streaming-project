import type { IVideo } from "../Videos"
import type { ApiSuccessResponse } from "./genericResponse"


export type GetAllVideosDto = ApiSuccessResponse<IVideo[]>