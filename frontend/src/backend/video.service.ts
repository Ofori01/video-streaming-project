import type { IVideo } from "@/types/Videos";
import backendService from "./api.service";
import { endpoints } from "./constants";
import type { GetAllVideosDto } from "@/types/dtos/videos";

// get all videos

class VideoService {
  async getAllVideos(): Promise<IVideo[]> {
    const response = await backendService.get<GetAllVideosDto>(endpoints.getAllVideos)
    return response.data.data
  };

  // async getVideoById(id: number): Promise<IVideo> {
  //   return (await backendService.get(endpoints.getVideo(id))).data
  // }
}


export default new VideoService()
