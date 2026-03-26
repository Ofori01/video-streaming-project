import { UPLOAD_STATUS } from "@/types/Videos";
import { Dot, EllipsisVertical, Trash2 } from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "../ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  onDelete?: (videoId: number) => void;
  isDeleting?: boolean;
}

const statusBadge = (status: UPLOAD_STATUS) => {
  switch (status) {
    case UPLOAD_STATUS.PENDING:
      return (
        <Badge variant="secondary">
          <Spinner data-icon="inline-start" />
          {status}
        </Badge>
      );
    case UPLOAD_STATUS.PROCESSING:
      return (
        <Badge variant="secondary">
          <Spinner data-icon="inline-start" />
          {status}
        </Badge>
      );
    case UPLOAD_STATUS.COMPLETED:
      return (
        <Badge className="bg-green-600/80 text-white border-0">{status}</Badge>
      );
    case UPLOAD_STATUS.FAILED:
      return <Badge variant="destructive">{status}</Badge>;
    default:
      return null;
  }
};

const AdminVideoCard: React.FC<AdminVideoCardProps> = ({
  processingStatus,
  thumbnail,
  duration = "30 minutes",
  title,
  author,
  isHorizontal = true,
  createdAt,
  views = "20",
  onDelete,
  isDeleting = false,
}) => {
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  return (
    <div className="flex flex-col relative rounded-lg p-2 gap-2 hover:bg-red-900/30 hover:backdrop-blur-lg hover:cursor-pointer group transition-all ease-in-out duration-600">
      {/* video status badge */}
      <div className="flex flex-wrap gap-2 absolute -top-2 -right-1 z-100">
        {statusBadge(processingStatus)}
      </div>

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
            <div className="rounded-full self-start h-6 w-6 overflow-hidden">
              <img
                src={author.profileImage}
                alt={author.name}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          {/* title and author name */}
          <div className="flex flex-col gap-y-0 items-start text-primary">
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
        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="rounded-full p-1 hover:bg-secondary/30 hover:backdrop-blur-2xl"
                aria-label="Open actions"
              >
                <EllipsisVertical size={24} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={(event) => {
                  event.preventDefault();
                  setConfirmOpen(true);
                }}
                disabled={isDeleting || !onDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete video
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this video?</AlertDialogTitle>
              <AlertDialogDescription>
                This marks the video as deleted and schedules cleanup from storage.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={isDeleting}
                onClick={() => {
                  if (onDelete) {
                    onDelete(id);
                  }
                }}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
export default AdminVideoCard;
