import React from "react";
import FilterBar from "./FilterBar";
import VideoCard from "./VideoCard";
import profileImage from "../../assets/banner_2.png";
// interface props {
//   categories: string[];
//   currentVideoId: number;
// }

const RelatedVideosSection: React.FC = () => {
  // todo - fetch videos using the categories filter then filter the video being watched out
  return (
    <div className="pl-2 flex flex-col w-full">
      {/* filter bar */}
      <FilterBar className="sticky top-0 z-99" />
      {/* video cards */}
      <div className="flex flex-col gap-y-1">
        {Array.from({ length: 20 }).map((_, index) => (
          <VideoCard
            isHorizontal={true}
            key={index}
            author={{ name: "Mr Beast", profileImage: profileImage }}
            createdAt="4 days ago"
            duration="13:40"
            id={index}
            thumbnail={profileImage}
            title="Making people fight for money"
            views="125k"
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedVideosSection;
