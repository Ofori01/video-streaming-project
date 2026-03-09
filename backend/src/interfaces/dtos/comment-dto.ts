import { InferType, number, object, string } from "yup";


const createVideoCommentParamSchema = object({
    videoId: number().required("video id is required")
})

const createVideoCommentBodySchema = object({
    content: string().required("Comment content cannot be empty"),
    parentId: number().optional()

})

export const createVideoCommentSchema = object({
    params: createVideoCommentParamSchema,
    body: createVideoCommentBodySchema
})

export interface CreateVideoCommentParamDto extends InferType<typeof createVideoCommentParamSchema>{}
export interface CreateVideoCommentBodyDto extends InferType<typeof createVideoCommentBodySchema>{}