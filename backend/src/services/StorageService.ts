import { Upload } from "@aws-sdk/lib-storage"
import S3 from "../lib/aws/awsClient"
import envConfig from "../config/env.config"


class S3StorageService {
    private _bucket : string

    constructor(){}

    GetPublicUrl(key: string){
        return `${envConfig.AWS_BASE_URL}/key`
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

        await uploader.done()
        uploader.on("httpUploadProgress" ,(progress)=> {
            console.log(progress )
        })
        return {
            key: params.key, url: this.GetPublicUrl(params.key)
        }
    }
}