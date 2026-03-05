import { Clock4, Eye } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

interface VideoPosterCardProps {
  id: number;
  thumbnail: string;
  views: string;
  duration: string | null;
  title: string;
  description: string;
}

const VideoPosterCard: React.FC<VideoPosterCardProps> = ({
  id,
  description,
  duration,
  thumbnail,
  title,
  views,
}) => {
  return (
    <Link
      to={`/movies/${id}`}
      className="flex flex-col gap-y-4 p-3 h-full outline rounded-lg bg-gray-100/10 backdrop-blur-xl hover:bg-gray-100/20 transition-colors group"
    >
      <div className="w-full aspect-4/5 overflow-hidden rounded-lg">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          src={thumbnail}
          alt={title}
        />
      </div>
      {/* title and description */}
      <div>
        <h3 className="text-xl tracking-wide line-clamp-1">{title}</h3>
        <span className="text-wrap font-body text-gray-400 text-xs line-clamp-2">
          {description}
        </span>
      </div>
      <div className="inline-flex mt-auto justify-between items-center text-xs md:text-sm">
        <div className="rounded-[1234px] outline bg-transparent inline-flex items-center gap-x-1 px-2 py-1 w-fit">
          <Clock4 size={16} />
          <span>{duration ?? "—"}</span>
        </div>
        <div className="rounded-[1234px] outline bg-transparent inline-flex items-center gap-x-1 px-2 py-1 w-fit">
          <Eye size={16} />
          <span>{views}</span>
        </div>
      </div>
    </Link>
  );
};

export default React.memo(VideoPosterCard);
