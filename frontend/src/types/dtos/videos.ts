import type { ICategory, IDashboardStats, IVideo } from "../Videos";
import type { ApiSuccessResponse } from "./genericResponse";

export type GetAllVideosDto = ApiSuccessResponse<IVideo[]>;
export type GetVideoDto = ApiSuccessResponse<IVideo>;
export type GetAllVideoCategories = ApiSuccessResponse<ICategory[]>;
export type GetDashboardStatsDto = ApiSuccessResponse<IDashboardStats>;

export type UploadFileMetadataDto = {
	fileName: string;
	contentType: string;
	size: number;
};

export type CreateUploadSessionRequestDto = {
	video: UploadFileMetadataDto;
	thumbnail: UploadFileMetadataDto;
};

export type PresignedPostData = {
	url: string;
	fields: Record<string, string>;
	key: string;
};

export type CreateUploadSessionResponse = {
	uploadSessionId: number;
	expiresAt: string;
	video: PresignedPostData;
	thumbnail: PresignedPostData;
};

export type CreateUploadSessionDto = ApiSuccessResponse<CreateUploadSessionResponse>;

export type FinalizeVideoUploadRequestDto = {
	title: string;
	description: string;
	categoryId: number;
	uploadSessionId: number;
};
