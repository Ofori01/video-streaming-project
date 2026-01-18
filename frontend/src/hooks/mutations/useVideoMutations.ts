import videoService from "@/backend/video.service";
import { useMutation } from "@tanstack/react-query";

export const useCreateVideo = () => {
  return useMutation({
    mutationKey: ["video", "create"],
    mutationFn: (formData: FormData) => videoService.uploadVideo(formData),
  });
};
