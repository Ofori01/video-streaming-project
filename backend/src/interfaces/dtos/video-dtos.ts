import {
  FILE_TYPE,
  UPLOAD_STATUS,
  VIDEO_STATUS,
} from "../../lib/types/common/enums";

export interface CreateVideoDto {
  title: string;
  description: string;
  categoryId: number;
  uploadedByUserId?: number;
  status?: VIDEO_STATUS;
  processingStatus?: UPLOAD_STATUS;
  files?: [
    {
      url: string;
      type: FILE_TYPE;
    }
  ];
}

export interface GetAllVideosQuery {
  categoryId?: number;
  
}
