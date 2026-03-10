export type UploadFiles = {
  thumbnail: Express.Multer.File[];
  video: Express.Multer.File[];
}


export type videoUploadJobPayload =  {
  videoBuffer: string
  key: string
  mimeType: string
  createdAt: string,
  videoId: number
}

export type thumbnailUploadJobPayload = {
  thumbnailBuffer: string
  key: string
  mimeType: string
  createdAt: string
  videoId: number
}