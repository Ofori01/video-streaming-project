import { UPLOAD_STATUS } from "@/types/Videos";
import { Dot, EllipsisVertical } from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";

import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "../ui/skeleton";

interface AdminVideoCardProps {
  id: number;
  thumbnail: string | null;
  video: string | null;
  processingStatus: UPLOAD_STATUS;
  duration?: string | null;
  title: string;
  views?: string;
  createdAt: string;
  author: {
    profileImage: string;
    name: string;
  };
  isHorizontal: boolean;
}

const AdminVideoCard: React.FC<AdminVideoCardProps> = ({
  processingStatus,
  thumbnail,
  duration = "30 minutes",
  title,
  author,
  isHorizontal = true,
  createdAt,
  views = "20",
}) => {
  switch (processingStatus) {
    case UPLOAD_STATUS.PENDING:
    case UPLOAD_STATUS.PROCESSING:
      return (
        <div className="flex flex-col relative rounded-lg p-2  gap-2 hover:bg-red-900/30 hover:backdrop-blur-lg hover:cursor-pointer group transition-all ease-in-out duration-600">
          {/* video status */}

          {(processingStatus === UPLOAD_STATUS.PENDING ||
            processingStatus === UPLOAD_STATUS.PROCESSING) && (
            <div className="flex flex-wrap gap-2 absolute -top-2 -right-1 z-100">
              <Badge variant="secondary">
                <Spinner data-icon="inline-start" />
                {processingStatus}
              </Badge>
            </div>
          )}

          <div className="w-full aspect-video overflow-hidden rounded-lg relative">
            {/* display skeleton if no thumb */}
            {thumbnail ? (
              <img
                src={thumbnail}
                className="h-full w-full object-cover group-hover:scale-105 duration-300 transition-transform"
              />
            ) : (
              <Skeleton className="aspect-video w-full" />
            )}

            <div className="absolute bottom-1 right-1 bg-secondary/20 rounded-sm text-sm p-0.5 w-fit text-primary">
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
              <div className={`flex flex-col gap-y-0 items-start text-primary`}>
                <span className="text-primary text-md line-clamp-2 text-wrap font-body">
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
        </div>
      );
  }
};
export default AdminVideoCard;
