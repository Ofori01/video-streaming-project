import React from "react";
import { Card, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { User } from "lucide-react";

interface MovieCardProps {
  title: string;
  thumbnail: string;
  duration: number;
  author: string;
}

const MovieCardBanner: React.FC<MovieCardProps> = ({
  title,
  author,
  duration,
  thumbnail,
}) => {
  return (
    <Card className="w-full max-w-sm overflow-hidden relative min-h-48 p-0! border-0 flex flex-col justify-between">
      {/* Background image */}
      <img
        src={thumbnail}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      <CardHeader className="p-3 relative">
        <span className="outline text-secondary rounded-[1234px] px-3 py-1 text-sm w-fit">
          {duration} min
        </span>
      </CardHeader>

      <CardFooter className="relative flex flex-row px-3 py-2 items-center justify-between bg-linear-to-t from-black/60 to-transparent">
        <CardTitle className="font-heading text-white text-2xl tracking-wider">{title}</CardTitle>
        <span className="inline-flex gap-x-2 p-2 font-body items-center text-secondary backdrop-blur-sm bg-secondary/30 rounded-xl">
          <User size={16} />
          <p>{author}</p>
        </span>
      </CardFooter>
    </Card>
  );
};

export default MovieCardBanner;
