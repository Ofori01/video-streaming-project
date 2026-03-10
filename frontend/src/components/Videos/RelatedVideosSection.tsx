import React, { useState } from "react";
import FilterBar from "./FilterBar";
import VideoCard from "./VideoCard";
import banner3 from "../../assets/banner_3.jpg";
import { useGetAllVideos } from "@/hooks/queries/useVideoQuerries";
import { Skeleton } from "@/components/ui/skeleton";

interface RelatedVideosSectionProps {
  categoryId?: string;
  currentVideoId?: number;
}

const RelatedVideoCardSkeleton: React.FC = () => (
  <div className="flex flex-row gap-2 p-2">
    <Skeleton className="w-36 shrink-0 aspect-video rounded-lg opacity-20" />
    <div className="flex flex-col gap-1.5 flex-1 pt-1">
      <Skeleton className="h-3.5 w-full opacity-20" />
      <Skeleton className="h-3 w-3/4 opacity-20" />
      <Skeleton className="h-3 w-1/2 opacity-20" />
    </div>
  </div>
);

const RelatedVideosSection: React.FC<RelatedVideosSectionProps> = ({
  categoryId,
  currentVideoId,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | undefined
  >(categoryId);

  const { data = [], isLoading } = useGetAllVideos({
    categoryId: selectedCategoryId,
  });

  const relatedVideos = data.filter((v) => v.id !== currentVideoId);

  return (
    <div className="pl-2 flex flex-col w-full">
      {/* filter bar */}
      <FilterBar
        className="sticky top-0 z-99 px-10"
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />

      {/* video cards */}
      <div className="flex flex-col gap-y-1 mt-2">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <RelatedVideoCardSkeleton key={i} />
          ))
        ) : relatedVideos.length === 0 ? (
          <p className="text-gray-400 font-body text-sm text-center py-8">
            No related videos found.
          </p>
        ) : (
          relatedVideos.map((video) => {
            const duration =
              video.duration != null
                ? `${Math.floor(video.duration / 60)}:${String(
                    video.duration % 60,
                  ).padStart(2, "0")}`
                : null;
            return (
              <VideoCard
                isHorizontal
                key={video.id}
                id={video.id}
                author={{
                  name: video.uploadedBy.username,
                  profileImage: banner3,
                }}
                createdAt={new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }).format(new Date(video.createdAt))}
                duration={duration}
                thumbnail={video.thumbnail?.url ?? ""}
                title={video.title}
                views="—"
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default RelatedVideosSection;
