import FilterBar from "@/components/Videos/FilterBar";
import React, { useState } from "react";
import banner3 from "../assets/banner_3.jpg";
import VideoCard from "@/components/Videos/VideoCard";
import { useGetAllVideos } from "@/hooks/queries/useVideoQuerries";
import { Skeleton } from "@/components/ui/skeleton";

const VideoCardSkeleton: React.FC = () => (
  <div className="flex flex-col rounded-lg p-2 gap-2">
    <Skeleton className="w-full aspect-video rounded-lg opacity-20" />
    <div className="flex flex-row gap-x-3 pt-1">
      <Skeleton className="h-6 w-6 rounded-full opacity-20" />
      <div className="flex flex-col gap-1 flex-1">
        <Skeleton className="h-4 w-3/4 opacity-20" />
        <Skeleton className="h-3 w-1/2 opacity-20" />
        <Skeleton className="h-3 w-1/3 opacity-20" />
      </div>
    </div>
  </div>
);

const Movies: React.FC = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | undefined
  >(undefined);

  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useGetAllVideos({ categoryId: selectedCategoryId });

  return (
    <div className="bg-black text-secondary relative px-15 py-15 min-h-screen">
      {/* filters bar */}
      <FilterBar
        className="mt-10 top-10"
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />

      {/* error */}
      {isError && (
        <p className="mt-5 text-destructive font-body text-sm">
          {error.message}
        </p>
      )}

      {/* movie grid */}
      <div className="mt-5 grid grid-cols-1 gap-y-5 gap-x-5 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <VideoCardSkeleton key={i} />
            ))
          : data.map((video) => {
              const duration =
                video.duration != null
                  ? `${Math.floor(video.duration / 60)}:${String(video.duration % 60).padStart(2, "0")}`
                  : null;
              return (
                <VideoCard
                  title={video.title}
                  duration={duration}
                  id={video.id}
                  views="20m"
                  createdAt="3 months ago"
                  author={{
                    name: video.uploadedBy.username,
                    profileImage: banner3,
                  }}
                  key={video.id}
                  thumbnail={video.thumbnail?.url ?? ""}
                />
              );
            })}

        {!isLoading && data.length === 0 && (
          <p className="col-span-full text-center text-gray-400 font-body py-10">
            No videos found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Movies;
