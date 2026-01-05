import FilterBar from "@/components/Videos/FilterBar";
import React from "react";
import banner3 from "../assets/banner_3.jpg";
import VideoCard from "@/components/Videos/VideoCard";
import { useGetAllVideos } from "@/hooks/queries/useVideoQuerries";
const Movies: React.FC = () => {
  const { data, error, isLoading, isError } = useGetAllVideos();
  return (
    <div className="bg-black text-secondary relative px-15 py-15">
      {/* filters bar */}
      <FilterBar className="mt-10 top-10" />

      {/* movie list, 3 columns */}
      <div className="mt-5 grid grid-cols-1 gap-y-5 gap-x-5 md:grid-cols-2 lg:grid-cols-3">
        {data?.map((video, index) => (
          <VideoCard
            title={video.title}
            duration={video.duration}
            id={index}
            views="20m"
            createdAt="3 months ago"
            author={{ name: video.uploadedBy.username, profileImage: banner3 }}
            key={index}
            thumbnail={video.thumbnail.url}
          />
        ))}
      </div>
    </div>
  );
};

export default Movies;
