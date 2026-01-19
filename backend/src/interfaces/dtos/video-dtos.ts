import { Get } from "./../../../node_modules/type-fest/source/get.d";
import { boolean, InferType, mixed, number, object, string } from "yup";
import { title } from "process";


// ...existing code...

const GetAllVideosQuerySchema = object({
  categoryId: string().optional(),
  adminVideos: boolean().optional(),
});

export const GetAllVideosValidationSchema = object({
  query: GetAllVideosQuerySchema,
});

export interface GetAllVideosQuery extends InferType<
  typeof GetAllVideosQuerySchema
> {}

//create video---

const CreateVideoBodySchema = object({
  title: string()
    .required("Video title is required")
    .max(30, "Length must not be more than 30"),
  description: string()
    .required("Video Description is required")
    .max(255, "Description must not exceed 255 characters"),
  categoryId: number().required("categoryId is required"),
  uploadedByUserId: number().optional(),
});
export const CreateVideoFilesSchema = object({
  thumbnail: mixed()
    .required("thumbnail is required")
    .test(
      "thumb-count",
      "thumbnail must contain exactly 1 file",
      (v) => Array.isArray(v) && v.length === 1,
    ),
  video: mixed()
    .required("video is required")
    .test(
      "video-count",
      "video must contain exactly 1 file",
      (v) => Array.isArray(v) && v.length === 1,
    ),
});

export interface CreateVideoDto extends InferType<
  typeof CreateVideoBodySchema
> {}

export const CreateVideoSchema = object({
  body: CreateVideoBodySchema,
  files: CreateVideoFilesSchema,
});

const GetVideoQueryParams = object({
  id: number().required("Video id is required"),
});
export interface GetVideoQueryDto extends InferType<
  typeof GetVideoQueryParams
> {}

export const GetVideoSchema = object({
  params: GetVideoQueryParams,
});
