import { InferType, mixed, number, object, string } from "yup";
import {
  FILE_TYPE,
  UPLOAD_STATUS,
  VIDEO_STATUS,
} from "../../lib/types/common/enums";
import { title } from "process";

export interface CreateVideoDto {
  title: string;
  description: string;
  categoryId: number;
  uploadedByUserId?: number;
  status?: VIDEO_STATUS;
  processingStatus?: UPLOAD_STATUS;
  thumbnail: string;
  video: string;
}
export interface GetAllVideosQuery {
  categoryId?: number;
  
}


const CreateVideoBodySchema = object({
  title: string()
    .required("Video title is required")
    .max(30, "Length must not be more than 30"),
    description: string().required("Video Description is required").max(255, "Description must not exceed 255 characters"),
    categoryId: number().required("categoryId is required"),
    uploadedByUserId: number().optional(),
});

export interface CreateVideoDto extends InferType<typeof CreateVideoBodySchema>{}


export const CreateVideoSchema = object({
  body: CreateVideoBodySchema
})