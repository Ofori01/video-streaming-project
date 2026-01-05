
export const endpoints = {
    //auth
    login: '/login',

    // videos
    getAllVideos: '/video',
    getVideo: (videoId: number) => `/videos/${videoId}`

}

