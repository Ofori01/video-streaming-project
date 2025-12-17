import { S3Client } from "@aws-sdk/client-s3";
import envConfig from "../../config/env.config";


const S3 = new S3Client({
    region: envConfig.AWS_REGION,
    credentials: {
        accessKeyId: envConfig.AWS_ACCESS_KEY,
        secretAccessKey: envConfig.AWS_SECRET_ACCESS_KEY,
    }
    
})

export default S3