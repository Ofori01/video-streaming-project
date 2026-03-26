import { boolean, InferType, mixed, number, object, string } from "yup";

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
    .max(1000, "Description must not exceed 1000 characters"),
  categoryId: number().required("categoryId is required"),
  uploadSessionId: number().required("uploadSessionId is required"),
  uploadedByUserId: number().optional(),
});

export interface CreateVideoDto extends InferType<
  typeof CreateVideoBodySchema
> {}

export const CreateVideoSchema = object({
  body: CreateVideoBodySchema,
});

const UploadFileMetadataSchema = object({
  fileName: string().required("fileName is required").max(255),
  contentType: string().required("contentType is required").max(100),
  size: number().required("size is required").positive(),
});

const CreateUploadSessionBodySchema = object({
  video: UploadFileMetadataSchema.required(),
  thumbnail: UploadFileMetadataSchema.required(),
});

export interface CreateUploadSessionDto extends InferType<
  typeof CreateUploadSessionBodySchema
> {}

export const CreateUploadSessionSchema = object({
  body: CreateUploadSessionBodySchema,
});

export type CreateUploadSessionResponse = {
  uploadSessionId: number;
  expiresAt: string;
  video: {
    url: string;
    fields: Record<string, string>;
    key: string;
  };
  thumbnail: {
    url: string;
    fields: Record<string, string>;
    key: string;
  };
};

const GetVideoQueryParams = object({
  id: number().required("Video id is required"),
});
export interface GetVideoQueryDto extends InferType<
  typeof GetVideoQueryParams
> {}

export const GetVideoSchema = object({
  params: GetVideoQueryParams,
});

export const FinalizeUploadSessionSchema = object({
  body: CreateVideoBodySchema,
});
