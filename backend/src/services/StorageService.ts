import { Upload } from "@aws-sdk/lib-storage"
import S3 from "../lib/aws/awsClient"
import envConfig from "../config/env.config"


export default class S3StorageService {

    constructor(){}

    GetPublicUrl(key: string){
        return `${envConfig.AWS_BASE_URL}/${key}`
    }

    async upload(params: {
        key: string,
        body: Buffer,
        contentType?: string,
        metaData?: Record<string, string>
    }){
        const uploader = new Upload({
            client: S3,
            params: {
                Bucket: envConfig.AWS_BUCKET,
                Key: params.key,
                Body: params.body,
                ContentType: params.contentType,
                Metadata: params.metaData

            }
        })
        // Todo - add progress event response to client
        uploader.on("httpUploadProgress" ,(progress)=> {
            console.log(progress )
        })
        await uploader.done()
        return {
            key: params.key, url: this.GetPublicUrl(params.key)
        }
    }
}