import { cn } from "@/lib/utils";
import React from "react";
import ReactPlayer from "react-player";

interface VideoPlayerProps {
  className?: string;
  url: string;
  /** Thumbnail URL shown as poster before playback starts. Pass false to disable. */
  light?: string | boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  className,
  url,
  light = true,
}) => {
  return (
    <div
      className={cn(
        className,
        "w-full aspect-video rounded-xl overflow-hidden",
      )}
    >
      <ReactPlayer
        src={url}
        light={light}
        controls
        width="100%"
        height="100%"
        playsInline
      />
    </div>
  );
};

export default VideoPlayer;
