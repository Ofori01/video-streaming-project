import { execFile } from "child_process";
import { promisify } from "util";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

const execFileAsync = promisify(execFile);

const MB = 1024 * 1024;

function calculateFastStartTimeoutMs(fileSizeBytes: number): number {
  const minTimeoutMs = 30_000;
  const maxTimeoutMs = 8 * 60_000;
  const sizeInMb = fileSizeBytes / MB;

  // Base + size-based buffer so larger files do not prematurely fall back.
  const estimatedTimeoutMs = Math.round(minTimeoutMs + sizeInMb * 120);
  return Math.min(maxTimeoutMs, Math.max(minTimeoutMs, estimatedTimeoutMs));
}

/**
 * Process video with ffmpeg to apply faststart optimization.
 * Moves moov atom to beginning of file for faster streaming startup.
 * Falls back to original buffer if ffmpeg fails or is unavailable.
 */
export async function applyFastStart(
  videoBuffer: Buffer,
  originalKey: string,
): Promise<Buffer> {
  try {
    const timeoutMs = calculateFastStartTimeoutMs(videoBuffer.length);

    // Create temp files in OS temp directory
    const tempDir = os.tmpdir();
    const inputPath = path.join(
      tempDir,
      `input-${Date.now()}-${Math.random().toString(36).slice(2)}.mp4`,
    );
    const outputPath = path.join(
      tempDir,
      `output-${Date.now()}-${Math.random().toString(36).slice(2)}.mp4`,
    );

    // Write input buffer to temp file
    await fs.promises.writeFile(inputPath, videoBuffer);

    try {
      // Run ffmpeg: copy codec, apply faststart
      const { stderr } = await execFileAsync(
        "ffmpeg",
        [
          "-i",
          inputPath,
          "-c",
          "copy", // copy codec (no re-encode, just remux)
          "-movflags",
          "+faststart", // move moov atom to front
          "-f",
          "mp4",
          outputPath,
        ],
        {
          timeout: timeoutMs,
          maxBuffer: 100 * 1024 * 1024, // 100MB buffer for large videos
        },
      );

      // Read processed file
      const processedBuffer = await fs.promises.readFile(outputPath);

      // Cleanup
      await Promise.all([
        fs.promises.unlink(inputPath).catch(() => {}),
        fs.promises.unlink(outputPath).catch(() => {}),
      ]);

      console.log(
        `[faststart] Processed ${originalKey}: ${videoBuffer.length} → ${processedBuffer.length} bytes`,
      );
      return processedBuffer;
    } catch (ffmpegError) {
      // Cleanup on error
      await Promise.all([
        fs.promises.unlink(inputPath).catch(() => {}),
        fs.promises.unlink(outputPath).catch(() => {}),
      ]);

      console.warn(
        `[faststart] ffmpeg processing failed for ${originalKey} (timeout ${timeoutMs}ms), using original:`,
        ffmpegError,
      );
      return videoBuffer; // fallback to original
    }
  } catch (error) {
    console.error(
      `[faststart] Temp file handling failed for ${originalKey}:`,
      error,
    );
    return videoBuffer; // fallback to original
  }
}
