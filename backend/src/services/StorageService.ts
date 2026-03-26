import { Upload } from "@aws-sdk/lib-storage";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  type HeadObjectCommandOutput,
  type ListObjectsV2CommandOutput,
} from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import S3 from "../lib/aws/awsClient";
import envConfig from "../config/env.config";

export default class S3StorageService {
  constructor() {}

  async createPresignedPost(params: {
    key: string;
    contentType: string;
    maxSize: number;
    expiresInSeconds: number;
  }) {
    const policy = await createPresignedPost(S3, {
      Bucket: envConfig.AWS_BUCKET,
      Key: params.key,
      Expires: params.expiresInSeconds,
      Conditions: [
        ["content-length-range", 1, params.maxSize],
        ["eq", "$Content-Type", params.contentType],
      ],
      Fields: {
        "Content-Type": params.contentType,
      },
    });

    return {
      url: policy.url,
      fields: policy.fields,
      key: params.key,
    };
  }

  async getObjectMetadata(
    key: string,
  ): Promise<HeadObjectCommandOutput | null> {
    try {
      return await S3.send(
        new HeadObjectCommand({
          Bucket: envConfig.AWS_BUCKET,
          Key: key,
        }),
      );
    } catch {
      return null;
    }
  }

  async getObjectBuffer(key: string): Promise<Buffer> {
    const result = await S3.send(
      new GetObjectCommand({
        Bucket: envConfig.AWS_BUCKET,
        Key: key,
      }),
    );

    if (!result.Body) {
      throw new Error(`S3 object body not found for key: ${key}`);
    }

    const bytes = await result.Body.transformToByteArray();
    return Buffer.from(bytes);
  }

  async deleteObject(key: string): Promise<void> {
    await S3.send(
      new DeleteObjectCommand({
        Bucket: envConfig.AWS_BUCKET,
        Key: key,
      }),
    );
  }

  async listObjectKeys(prefix: string): Promise<string[]> {
    const keys: string[] = [];
    let continuationToken: string | undefined = undefined;

    do {
      const result: ListObjectsV2CommandOutput = await S3.send(
        new ListObjectsV2Command({
          Bucket: envConfig.AWS_BUCKET,
          Prefix: prefix,
          ContinuationToken: continuationToken,
        }),
      );

      for (const item of result.Contents ?? []) {
        if (item.Key) {
          keys.push(item.Key);
        }
      }

      continuationToken = result.IsTruncated
        ? result.NextContinuationToken
        : undefined;
    } while (continuationToken);

    return keys;
  }

  GetPublicUrl(key: string) {
    const mediaBaseUrl = (
      envConfig.AWS_CDN_BASE_URL ?? envConfig.AWS_BASE_URL
    ).replace(/\/+$/, "");
    const normalizedKey = key.replace(/^\/+/, "");
    return `${mediaBaseUrl}/${normalizedKey}`;
  }

  async upload(params: {
    key: string;
    body: Buffer;
    contentType?: string;
    metaData?: Record<string, string>;
    onProgress?: (loaded: number, total: number) => void;
  }) {
    const uploader = new Upload({
      client: S3,
      params: {
        Bucket: envConfig.AWS_BUCKET,
        Key: params.key,
        Body: params.body,
        ContentType: params.contentType,
        CacheControl: "public, max-age=31536000, immutable",
        Metadata: params.metaData,
      },
    });
    // Todo - add progress event response to client
    uploader.on("httpUploadProgress", (progress) => {
      if (
        params.onProgress &&
        progress.loaded != null &&
        progress.total != null
      ) {
        params.onProgress(progress.loaded, progress.total);
      }
    });
    await uploader.done();
    return {
      key: params.key,
      url: this.GetPublicUrl(params.key),
    };
  }
}
