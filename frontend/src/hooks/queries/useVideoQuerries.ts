import videoService from "@/backend/video.service";
import type { ApiErrorResponse } from "@/types/errors";
import type { IVideo } from "@/types/Videos";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";


interface VideoFilters {
    category?: string
    status?: string
    search?: string
}

const videoKeys = {
    all: ['videos'] as const,
    lists: ()=> [...videoKeys.all, "lists"] as const,
    list: (filters?:VideoFilters ) => [...videoKeys.lists(), {filters}] as const,
    details: ()=> [...videoKeys.all, "detail"] as const,
    detail: (id: number) => [...videoKeys.details(), id] as const
}

export const useGetAllVideos = (filters?: VideoFilters, options?: Omit<UseQueryOptions<IVideo[], ApiErrorResponse>, "queryKey" | "queryFn">) => {
    return useQuery<IVideo[], ApiErrorResponse>({
        queryKey: videoKeys.list(filters),
        queryFn:  ()=> videoService.getAllVideos(),
        ...options
    })

}

