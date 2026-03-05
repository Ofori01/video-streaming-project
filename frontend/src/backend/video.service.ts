import type { IDashboardStats, IVideo } from "@/types/Videos";
import backendService from "./api.service";
import { endpoints } from "./constants";
import type {
  GetAllVideoCategories,
  GetAllVideosDto,
  GetDashboardStatsDto,
  GetVideoDto,
} from "@/types/dtos/videos";
import type { VideoFilters } from "@/hooks/queries/useVideoQuerries";

// get all videos

class VideoService {
  async getAllVideos(filters?: VideoFilters): Promise<IVideo[]> {
    const response = await backendService.get<GetAllVideosDto>(
      endpoints.getAllVideos,
      {
        params: filters,
      },
    );
    return response.data.data;
  }

  async uploadVideo(videoData: FormData): Promise<IVideo> {
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
}

export default new VideoService();
