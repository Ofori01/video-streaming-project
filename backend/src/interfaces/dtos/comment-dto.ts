import { InferType, number, object, string } from "yup";

const createVideoCommentParamSchema = object({
  videoId: number().required("video id is required"),
});

const createVideoCommentBodySchema = object({
  content: string().required("Comment content cannot be empty"),
  parentId: number().optional(),
});

export const createVideoCommentSchema = object({
  params: createVideoCommentParamSchema,
  body: createVideoCommentBodySchema,
});

export interface CreateVideoCommentParamDto extends InferType<
  typeof createVideoCommentParamSchema
> {}
export interface CreateVideoCommentBodyDto extends InferType<
  typeof createVideoCommentBodySchema
> {}

// --- Get comments (paginated) ---
const getCommentsQuerySchema = object({
  page: number().optional().default(1).min(1),
  limit: number().optional().default(10).min(1).max(100),
});

export const getCommentsSchema = object({
  params: createVideoCommentParamSchema,
  query: getCommentsQuerySchema,
});

export interface GetCommentsQueryDto extends InferType<
  typeof getCommentsQuerySchema
> {}

// --- Params that include both videoId and commentId ---
const commentParamsSchema = object({
  videoId: number().required("video id is required"),
  commentId: number().required("comment id is required"),
});

export const commentParamsOnlySchema = object({
  params: commentParamsSchema,
});

export interface CommentParamsDto extends InferType<
  typeof commentParamsSchema
> {}

// --- Update comment ---
const updateCommentBodySchema = object({
  content: string().required("Comment content cannot be empty"),
});

export const updateCommentSchema = object({
  params: commentParamsSchema,
  body: updateCommentBodySchema,
});

export interface UpdateCommentBodyDto extends InferType<
  typeof updateCommentBodySchema
> {}
