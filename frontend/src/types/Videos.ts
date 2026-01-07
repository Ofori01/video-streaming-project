export interface IVideo {
  id: number;
  title: string;
  description: string;
  duration: number | null;
  status: VIDEO_STATUS;
  processingStatus: UPLOAD_STATUS
  uploadedBy: {
    id: number
    username: string
  }
  category: {
    id: number
    createdAt:Date
    updatedAt: Date
    name: string
    description: string
  }
  thumbnail: {
    id: number
    createdAt: Date
    updatedAt: Date
    url: string
    type: FILE_TYPE
  }
  video: {
    createdAt: Date
    updatedAt: Date
    url: string
    type: FILE_TYPE
  }
  createdAt: Date;
  updatedAt: Date;
}



export enum VIDEO_STATUS {
  ACTIVE = "active",
  ARCHIVED = "archived",
  DELETED = "deleted",
}

export enum UPLOAD_STATUS {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

export enum FILE_TYPE {
  THUMBNAIL = "thumbnail",
  VIDEO = "video",
  PROFILE_PICTURE = "profilePicture",
}
