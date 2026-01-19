
export const endpoints = {
    //auth
    login: '/auth/login',
    verifyOtp: '/auth/verify-otp',
    signUp: '/auth/sign-up',
    availableRoles: 'auth/roles',

    // videos
    getAllVideos: '/video',
    getVideo: (videoId: number) => `/videos/${videoId}`,
    createVideo: "/video",
    getAllCategories: "/category"

}

