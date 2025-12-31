import { cn } from '@/lib/utils';
import React from 'react'
import ReactPlayer from "react-player";


interface VideoPlayerProps {
    className?: string
}

// todo - will take videoUrl as prop

const VideoPlayer : React.FC<VideoPlayerProps> = ({className}) => {
  return (
    <div className={cn(className, " w-full rounded-xl  overflow-hidden ")}>
            <ReactPlayer
              controls
              src="https://www.youtube.com/watch?v=LXb3EKWsInQ"
              style={{ width: "100%", height: "auto", aspectRatio: "16/9" }}
            />
          </div>
  )
}

export default VideoPlayer
