import { Dot, EllipsisVertical } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

interface VideoCardProps {
  id: number;
  thumbnail: string;
  author: {
    profileImage: string;
    name: string;
  };
  duration: string | null;
  title: string;
  views: string;
  createdAt: string;

  //card items alignment prop
  isHorizontal?: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({
  author,
  createdAt,
  duration,
  thumbnail,
  title,
  views,
  id,
  isHorizontal = false,
}) => {
  return (
    <Link
      to={`/movies/${id}`}
      className={` ${isHorizontal ? "flex-row" : "flex-col"} flex rounded-lg p-2  gap-2 hover:bg-red-900/30 hover:backdrop-blur-lg hover:cursor-pointer group transition-all ease-in-out duration-600`}
    >
      {/* thumbnail and duration */}
      <div className="w-full aspect-video overflow-hidden rounded-lg relative">
        <img
          src={thumbnail}
          className="h-full w-full object-cover group-hover:scale-105 duration-300 transition-transform"
        />
        <div className="absolute bottom-1 right-1 bg-black rounded-sm text-sm p-0.5 w-fit text-secondary">
          {duration}
        </div>
      </div>

      <div className="flex flex-row items-start justify-between">
        <div className="flex flex-row items-center gap-x-3">
          {/* profile image */}
          {!isHorizontal && (
            <div className=" rounded-full self-start h-6 w-6 overflow-hidden">
              <img
                src={author.profileImage}
                alt={author.name}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          {/* title and author name */}
          <div className={`flex flex-col gap-y-0 items-start text-gray-400`}>
            <span className="text-secondary text-md line-clamp-2 text-wrap font-body">
              {title}
            </span>
            <span className="line-clamp-1 font-body text-wrap">
              {author.name}
            </span>
            <span className="inline-flex items-center font-body text-nowrap">
              <p>{views} views</p>
              <Dot size={24} />
              <p> {createdAt} </p>
            </span>
          </div>
        </div>
        <EllipsisVertical
          size={24}
          className="hover:bg-secondary/30 hover:backdrop-blur-2xl rounded-full p-1"
        />
      </div>
    </Link>
  );
};

export default VideoCard;
