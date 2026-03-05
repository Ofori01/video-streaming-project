import React, { useEffect } from "react";
import VideoDescriptionCard from "@/components/Videos/VideoDescriptionCard";
import VideoPlayer from "@/components/Videos/VideoPlayer";
import RelatedVideosSection from "@/components/Videos/RelatedVideosSection";
import { useParams } from "react-router-dom";
import { useGetVideoById } from "@/hooks/queries/useVideoQuerries";
import { Skeleton } from "@/components/ui/skeleton";
import profile1 from "../assets/banner_1.png";

const Movie: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const videoId = Number(id);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);

  const { data: video, isPending, isError, error } = useGetVideoById(videoId);

  if (isError) {
    return (
      <div className="min-h-screen py-15 px-15 text-secondary flex items-center justify-center">
        <p className="text-destructive font-body">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-15 px-15 text-secondary ">
      {/* content */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-x-3 h-full">
        {/* video player */}
        <div className="col-span-2">
          {isPending ? (
            <Skeleton className="w-full aspect-video rounded-xl opacity-20" />
          ) : (
            <VideoPlayer
              className="spread-bg"
              url={video.video?.url ?? ""}
              light={video.thumbnail?.url || false}
            />
          )}

          {/* title and user profile */}
          <div className="mt-2 flex flex-col gap-2">
            {isPending ? (
              <>
                <Skeleton className="h-6 w-3/4 opacity-20" />
                <Skeleton className="h-10 w-48 opacity-20" />
              </>
            ) : (
              <>
                <span className="text-xl font-medium">{video.title}</span>
                <div className="inline-flex justify-between items-center">
                  <div className="flex flex-row gap-x-3">
                    <div className="w-13 h-13 rounded-full overflow-hidden">
                      <img
                        src={profile1}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="tracking-wide text-lg">
                        {video.uploadedBy.username}
                      </span>
                      <span className="text-gray-400">Creator</span>
                    </div>
                  </div>
                  <button className="py-3 px-5 bg-gray-200 text-sm cursor-pointer hover:bg-gray-300 text-primary rounded-[1234px]">
                    Subscribe
                  </button>
                </div>
              </>
            )}
          </div>

          {/* video description */}
          {!isPending && video && (
            <VideoDescriptionCard
              createdAt={new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }).format(new Date(video.createdAt))}
              categories={video.category ? [video.category.name] : []}
              description={video.description}
            />
          )}
        </div>

        {/* related videos section */}
        <div className="col-span-1 overflow-y-auto mt-5 lg:mt-0 h-screen custom-scrollbar">
          <RelatedVideosSection
            categoryId={video?.category ? String(video.category.id) : undefined}
            currentVideoId={videoId}
          />
        </div>
      </div>
    </div>
  );
};

export default Movie;
