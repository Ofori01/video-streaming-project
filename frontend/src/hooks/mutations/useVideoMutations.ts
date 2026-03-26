import videoService from "@/backend/video.service";
import { useMutation } from "@tanstack/react-query";
import type { FinalizeVideoUploadRequestDto } from "@/types/dtos/videos";
import { useQueryClient } from "@tanstack/react-query";

export const useCreateVideo = () => {
  return useMutation({
    mutationKey: ["video", "create"],
    mutationFn: (payload: FinalizeVideoUploadRequestDto) =>
      videoService.uploadVideo(payload),
  });
};

export const useDeleteVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["video", "delete"],
    mutationFn: (videoId: number) => videoService.deleteVideo(videoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
};
