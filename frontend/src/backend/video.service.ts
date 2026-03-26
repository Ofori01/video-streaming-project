import axios from "axios";
import type { IDashboardStats, IVideo } from "@/types/Videos";
import backendService from "./api.service";
import { endpoints } from "./constants";
import type {
  CreateUploadSessionDto,
  CreateUploadSessionRequestDto,
  FinalizeVideoUploadRequestDto,
  GetAllVideoCategories,
  GetAllVideosDto,
  GetDashboardStatsDto,
  GetVideoDto,
  PresignedPostData,
} from "@/types/dtos/videos";
import type { VideoFilters } from "@/hooks/queries/useVideoQuerries";

// get all videos

class VideoService {
  async getAllVideos(filters?: VideoFilters): Promise<IVideo[]> {
    const useAdminEndpoint = Boolean(filters?.adminVideos);
    const endpoint = useAdminEndpoint
      ? endpoints.getAllVideosAdmin
      : endpoints.getAllVideos;

    const queryFilters = useAdminEndpoint
      ? filters
      : (({ adminVideos, ...rest }) => rest)(filters ?? {});

    const response = await backendService.get<GetAllVideosDto>(
      endpoint,
      {
        params: queryFilters,
      },
    );
    return response.data.data;
  }

  async createUploadSession(
    payload: CreateUploadSessionRequestDto,
  ): Promise<CreateUploadSessionDto["data"]> {
    const response = await backendService.post<CreateUploadSessionDto>(
      endpoints.createUploadSession,
      payload,
    );

    return response.data.data;
  }

  async uploadFileToS3(
    presignedPostData: PresignedPostData,
    file: File,
    onProgress?: (percent: number) => void,
  ): Promise<void> {
    const formData = new FormData();
    for (const [field, value] of Object.entries(presignedPostData.fields)) {
      formData.append(field, value);
    }
    formData.append("file", file);

    await axios.post(presignedPostData.url, formData, {
      onUploadProgress(progressEvent) {
        if (!onProgress || !progressEvent.total) {
          return;
        }
        const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        onProgress(percent);
      },
    });
  }

  async uploadVideo(videoData: FinalizeVideoUploadRequestDto): Promise<IVideo> {
    const response = await backendService.post<GetVideoDto>(
      endpoints.createVideo,
      videoData,
    );
    return response.data.data;
  }

  async getAllVideoCategories() {
    const response = await backendService.get<GetAllVideoCategories>(
      endpoints.getAllCategories,
    );
    return response.data.data;
  }

  async getDashboardStats(): Promise<IDashboardStats> {
    const response = await backendService.get<GetDashboardStatsDto>(
      endpoints.getDashboardStats,
    );
    return response.data.data;
  }
  async getVideoById(id: number): Promise<IVideo> {
    const response = await backendService.get<GetVideoDto>(
      endpoints.getVideo(id),
    );
    return response.data.data;
  }

  async deleteVideo(id: number): Promise<void> {
    await backendService.delete(endpoints.deleteVideo(id));
  }
}

export default new VideoService();
