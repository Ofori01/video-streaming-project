import backendService from "./api.service";
import { endpoints } from "./constants";
import type { IComment } from "@/types/Comments";
import type {
  CreateCommentPayload,
  GetCommentDto,
  GetCommentsDto,
  GetRepliesDto,
} from "@/types/dtos/comments";
import type { PaginationMeta } from "@/types/dtos/genericResponse";

export interface CommentsPage {
  comments: IComment[];
  pagination: PaginationMeta;
}

class CommentService {
  async getVideoComments(
    videoId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<CommentsPage> {
    const response = await backendService.get<GetCommentsDto>(
      endpoints.getVideoComments(videoId),
      { params: { page, limit } },
    );
    return {
      comments: response.data.data,
      pagination: response.data.pagination,
    };
  }

  async getCommentReplies(
    videoId: number,
    commentId: number,
  ): Promise<IComment[]> {
    const response = await backendService.get<GetRepliesDto>(
      endpoints.getCommentReplies(videoId, commentId),
    );
    return response.data.data;
  }

  async createComment(
    videoId: number,
    data: CreateCommentPayload,
  ): Promise<IComment> {
    const response = await backendService.post<GetCommentDto>(
      endpoints.createComment(videoId),
      data,
    );
    return response.data.data;
  }

  async updateComment(
    videoId: number,
    commentId: number,
    content: string,
  ): Promise<IComment> {
    const response = await backendService.patch<GetCommentDto>(
      endpoints.updateComment(videoId, commentId),
      { content },
    );
    return response.data.data;
  }

  async deleteComment(videoId: number, commentId: number): Promise<void> {
    await backendService.delete(endpoints.deleteComment(videoId, commentId));
  }
}

export default new CommentService();
