import type { IComment } from "../Comments";
import type {
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from "./genericResponse";

export type GetCommentsDto = ApiPaginatedResponse<IComment>;
export type GetCommentDto = ApiSuccessResponse<IComment>;
export type GetRepliesDto = ApiSuccessResponse<IComment[]>;

export interface CreateCommentPayload {
  content: string;
  parentId?: number;
}

export interface UpdateCommentPayload {
  content: string;
}
