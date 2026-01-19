import videoService from "@/backend/video.service";
import type { ApiErrorResponse } from "@/types/errors";
import type { ICategory, IVideo } from "@/types/Videos";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

export interface VideoFilters {
  category?: string;
  status?: string;
  search?: string;
  adminVideos?: boolean;
}

const videoKeys = {
  all: ["videos"] as const,
  lists: () => [...videoKeys.all, "lists"] as const,
  list: (filters?: VideoFilters) =>
    [...videoKeys.lists(), { filters }] as const,
  details: () => [...videoKeys.all, "detail"] as const,
  detail: (id: number) => [...videoKeys.details(), id] as const,
  categories: () => [...videoKeys.all, "categories"] as const,
};

export const useGetAllVideos = (
  filters?: VideoFilters,
  options?: Omit<
    UseQueryOptions<IVideo[], ApiErrorResponse>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<IVideo[], ApiErrorResponse>({
    queryKey: videoKeys.list(filters),
    queryFn: () => videoService.getAllVideos(filters),
    ...options,
  });
};

export const useGetAllVideoCategories = () => {
  return useQuery<ICategory[], ApiErrorResponse>({
    queryKey: videoKeys.categories(),
    queryFn: () => videoService.getAllVideoCategories(),
  });
};
