import type { ICategory, IDashboardStats, IVideo } from "../Videos";
import type { ApiSuccessResponse } from "./genericResponse";

export type GetAllVideosDto = ApiSuccessResponse<IVideo[]>;
export type GetVideoDto = ApiSuccessResponse<IVideo>;
export type GetAllVideoCategories = ApiSuccessResponse<ICategory[]>;
export type GetDashboardStatsDto = ApiSuccessResponse<IDashboardStats>;
