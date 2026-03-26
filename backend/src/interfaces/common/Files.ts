export type UploadFiles = {
  thumbnail: Express.Multer.File[];
  video: Express.Multer.File[];
}


export type videoUploadJobPayload =  {
  sourceKey: string
  key: string
  mimeType: string
  createdAt: string,
  videoId: number
}

export type thumbnailUploadJobPayload = {
  sourceKey: string
  key: string
  mimeType: string
  createdAt: string
  videoId: number
}