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

  // SSE
  uploadProgressSse: (videoId: number) => `/sse/${videoId}`,
};
