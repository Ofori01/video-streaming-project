
export const endpoints = {
    //auth
    login: '/auth/login',
    verifyOtp: '/auth/verify-otp',

    // videos
    getAllVideos: '/video',
    getVideo: (videoId: number) => `/videos/${videoId}`

}

