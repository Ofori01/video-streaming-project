import videoService from "@/backend/video.service";
import type { ApiErrorResponse } from "@/types/errors";
import type { ICategory, IDashboardStats, IVideo } from "@/types/Videos";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

export interface VideoFilters {
  categoryId?: string;
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
  dashboardStats: () => [...videoKeys.all, "dashboard-stats"] as const,
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

export const useGetDashboardStats = () => {
  return useQuery<IDashboardStats, ApiErrorResponse>({
    queryKey: videoKeys.dashboardStats(),
    queryFn: () => videoService.getDashboardStats(),
  });
};

export const useGetVideoById = (id: number) => {
  return useQuery<IVideo, ApiErrorResponse>({
    queryKey: videoKeys.detail(id),
    queryFn: () => videoService.getVideoById(id),
    enabled: !!id && id > 0,
  });
};
