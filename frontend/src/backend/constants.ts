export const endpoints = {
  //auth
  login: "/auth/login",
  verifyOtp: "/auth/verify-otp",
  signUp: "/auth/sign-up",
  availableRoles: "auth/roles",

  // videos
  getAllVideos: "/video",
  getVideo: (videoId: number) => `/video/${videoId}`,
  createVideo: "/video",
  getAllCategories: "/category",

  // dashboard
  getDashboardStats: "/video/stats",

  // comments
  getVideoComments: (videoId: number) => `/comments/${videoId}`,
  getCommentReplies: (videoId: number, commentId: number) =>
    `/comments/${videoId}/${commentId}/replies`,
  createComment: (videoId: number) => `/comments/${videoId}`,
  updateComment: (videoId: number, commentId: number) =>
    `/comments/${videoId}/${commentId}`,
  deleteComment: (videoId: number, commentId: number) =>
    `/comments/${videoId}/${commentId}`,

  // SSE
  uploadProgressSse: (videoId: number) => `/sse/${videoId}`,
};
