// import VideoCard from "@/components/Videos/VideoCard";
import { useGetAllVideos } from "@/hooks/queries/useVideoQuerries";
import React from "react";
import banner3 from "../../assets/banner_3.jpg";
import AdminVideoCard from "@/components/Videos/AdminVideoCard";
import { useDeleteVideo } from "@/hooks/mutations/useVideoMutations";
import { toast } from "sonner";

const AdminVideos: React.FC = () => {
  const deleteVideoMutation = useDeleteVideo();

  const {
    data = [],
    isPending,
    isError,
    error,
  } = useGetAllVideos({ adminVideos: true });

  const handleDelete = async (videoId: number) => {
    try {
      await deleteVideoMutation.mutateAsync(videoId);
      toast.success("Video marked for deletion");
    } catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete video";
      toast.error("Delete failed", { description: message });
    }
  };

  if (isPending) {
    return <div className="mx-auto py-8 px-4 max-w-4xl">Loading</div>;
  }

  if (isError) {
    return <div className="mx-auto py-8 px-4 max-w-4xl">{error.message}</div>;
  }

  if (data.length === 0) {
    return <div className="mx-auto py-8 px-4 max-w-4xl">no data</div>;
  }

  return (
    <div className="h-screen">
      <div className="px-2 mx-15 pb-4 pt-2 max-w-4xl grid grid-cols-1 gap-y-5 gap-x-5 md:grid-cols-2 lg:grid-cols-3">
        {data.map((video) => (
          <AdminVideoCard
            title={video.title}
            // duration={video.duration}
            id={video.id}
            video={video?.video?.url ?? null}
            processingStatus={video.processingStatus}
            isHorizontal
            createdAt="3 Months ago"
            author={{ name: video.uploadedBy.username, profileImage: banner3 }}
            key={video.id}
            thumbnail={video?.thumbnail?.url ?? null}
            onDelete={handleDelete}
            isDeleting={
              deleteVideoMutation.isPending &&
              deleteVideoMutation.variables === video.id
            }
          />
          // <VideoCard
          //   title={video.title}
          //   duration={video.duration}
          //   id={index}
          //   views="20m"
          //   createdAt="3 months ago"
          //   author={{ name: video.uploadedBy.username, profileImage: banner3 }}
          //   key={index}
          //   thumbnail={video.thumbnail.url}
          // />
        ))}
      </div>
    </div>
  );
};

export default AdminVideos;
