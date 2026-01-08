
export const endpoints = {
    //auth
    login: '/auth/login',

    // videos
    getAllVideos: '/video',
    getVideo: (videoId: number) => `/videos/${videoId}`

}

