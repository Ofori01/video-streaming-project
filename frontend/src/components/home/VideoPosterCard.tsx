import { Clock4, Eye } from "lucide-react";
import React from "react";

interface VideoPosterCardProps {
  thumbnail: string;
  views: string;
  duration: string;
  title: string;
  description: string;
}

const VideoPosterCard: React.FC<VideoPosterCardProps> = ({
  description,
  duration,
  thumbnail,
  title,
  views,
}) => {
  return (
    <div className="flex flex-col gap-y-4 p-3 h-full  outline rounded-lg bg-gray-100/10 backdrop-blur-xl">
      <div className="w-full  aspect-4/5 overflow-hidden rounded-lg">
        <img
          className="w-full h-full object-cover"
          src={thumbnail}
          alt="Movie poster"
        />
      </div>
      {/* title and description */}
      <div>
        <h3 className="text-xl tracking-wide line-clamp-1">{title}</h3>
        <span className=" text-wrap font-body text-gray-400  text-xs line-clamp-2 "> {description} </span>
      </div>
      <div className="inline-flex mt-auto justify-between  items-center text-xs md:text-sm">
        <div className="rounded-[1234px] outline bg-transparent inline-flex items-center gap-x-1 px-2 py-1  w-fit">
          <Clock4 size={16} />
          <span>{duration}</span>
        </div>
        <div className="rounded-[1234px]  outline bg-transparent inline-flex items-center gap-x-1 px-2 py-1  w-fit">
          <Eye size={16} />
          <span>{views}</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(VideoPosterCard);
