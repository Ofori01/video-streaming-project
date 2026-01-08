
export const endpoints = {
    //auth
    login: '/auth/login',
    verifyOtp: '/auth/verify-otp',
    signUp: '/auth/sign-up',

    // videos
    getAllVideos: '/video',
    getVideo: (videoId: number) => `/videos/${videoId}`

}

