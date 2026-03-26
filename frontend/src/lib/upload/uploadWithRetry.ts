import type { PresignedPostData } from "@/types/dtos/videos";

export type UploadLabel = "video" | "thumbnail";

interface UploadWithRetryParams {
  presignedPostData: PresignedPostData;
  file: File;
  onProgress: (percent: number) => void;
  label: UploadLabel;
  uploadFn: (
    presignedPostData: PresignedPostData,
    file: File,
    onProgress?: (percent: number) => void,
  ) => Promise<void>;
  maxRetries?: number;
}

export async function uploadWithRetry({
  presignedPostData,
  file,
  onProgress,
  label,
  uploadFn,
  maxRetries = 3,
}: UploadWithRetryParams): Promise<void> {
  let lastError: unknown = null;

  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      await uploadFn(presignedPostData, file, onProgress);
      return;
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries) {
        const delay = 2 ** (attempt - 1) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
    }
  }

  throw new Error(
    `${label} upload failed after ${maxRetries} retries. The service may be temporarily unavailable.`,
    { cause: lastError as Error },
  );
}
