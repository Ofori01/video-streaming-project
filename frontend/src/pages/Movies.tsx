import FilterBar from "@/components/Videos/FilterBar";
import React from "react";
import banner3 from "../assets/banner_3.jpg";
import VideoCard from "@/components/Videos/VideoCard";
const Movies: React.FC = () => {
  return (
    <div className="bg-black text-secondary relative px-15 py-15">
      {/* filters bar */}
      <FilterBar className="mt-10 top-10" />

      {/* movie list, 3 columns */}
      <div className="mt-5 grid grid-cols-1 gap-y-5 gap-x-5 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 30 }).map((_, index) => (
          <VideoCard
            title="Nice title"
            duration="12:13"
            id = {index}
            views="20m"
            createdAt="2 years ago"
            author={{name: "Ofori", profileImage: banner3}}
            key={index}
            thumbnail={banner3}
          />
        ))}
      </div>
    </div>
  );
};

export default Movies;
