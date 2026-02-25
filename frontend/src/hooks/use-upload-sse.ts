import { useState, useEffect, useCallback, useRef } from "react";
import { store } from "@/store/store";
import envConfig from "@/config/envConfig";

export type UploadSSEStatus = "idle" | "connecting" | "uploading" | "complete" | "error";

interface UploadProgressData {
  percent: number;
  loaded?: number;
  total?: number;
}

interface UseUploadSSEReturn {
  percent: number;
  status: UploadSSEStatus;
  error: string | null;
  disconnect: () => void;
}

const MAX_RETRIES = 3;

/**
 * Fetch-based SSE hook for video upload progress.
 *
 * Uses the Fetch API (not EventSource) so we can send the Authorization header.
 * Follows the article's production patterns:
 *  - `mounted` flag prevents state updates after unmount
 *  - Exponential backoff retry (max 3 attempts)
 *  - Proper cleanup on unmount / disconnect
 *
 * @param videoId - The ID of the video being uploaded. Pass null to keep in idle state.
 * @param onComplete - Optional callback invoked when upload-complete event is received.
 */
function useUploadSSE(
  videoId: number | null,
  onComplete?: () => void
): UseUploadSSEReturn {
  const [percent, setPercent] = useState(0);
  const [status, setStatus] = useState<UploadSSEStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const disconnect = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  const connect = useCallback(
    async (id: number, mounted: { current: boolean }) => {
      disconnect();

      abortControllerRef.current = new AbortController();
      const token = store.getState().auth.token;
      const url = `${envConfig.backendUrl}/sse/${id}`;

      setStatus("connecting");

      try {
        const response = await fetch(url, {
          headers: {
            Accept: "text/event-stream",
            Authorization: `Bearer ${token}`,
          },
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`SSE connection failed: HTTP ${response.status}`);
        }
        if (!response.body) {
          throw new Error("SSE: No response body");
        }

        if (!mounted.current) return;
        setStatus("uploading");
        retryCountRef.current = 0;

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // SSE events are separated by double newlines
          const rawEvents = buffer.split("\n\n");
          buffer = rawEvents.pop() ?? "";

          for (const rawEvent of rawEvents) {
            if (!rawEvent.trim()) continue;

            // Parse event type and data from SSE frame lines
            let eventType = "message";
            let eventData = "";

            for (const line of rawEvent.split("\n")) {
              if (line.startsWith("event: ")) {
                eventType = line.slice(7).trim();
              } else if (line.startsWith("data: ")) {
                eventData += line.slice(6);
              }
              // Ignore comment lines (`:`) like heartbeats
            }

            if (!eventData) continue;

            try {
              const parsed = JSON.parse(eventData);

              if (!mounted.current) return;

              if (eventType === "upload-progress") {
                const data = parsed as UploadProgressData;
                setPercent(data.percent);
              } else if (eventType === "upload-complete") {
                setPercent(100);
                setStatus("complete");
                disconnect();
                onComplete?.();
                return;
              } else if (eventType === "upload-error") {
                setError(parsed.message ?? "Upload failed");
                setStatus("error");
                disconnect();
                return;
              }
            } catch {
              console.error("[useUploadSSE] Failed to parse event data:", eventData);
            }
          }
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;

        if (!mounted.current) return;

        if (retryCountRef.current < MAX_RETRIES) {
          const delay = Math.min(1000 * Math.pow(2, retryCountRef.current), 30_000);
          retryCountRef.current += 1;
          console.warn(`[useUploadSSE] Retrying in ${delay}ms (attempt ${retryCountRef.current})`);
          retryTimeoutRef.current = setTimeout(() => {
            if (mounted.current) {
              connect(id, mounted);
            }
          }, delay);
        } else {
          setError("Lost connection to upload progress stream");
          setStatus("error");
        }
      }
    },
    [disconnect, onComplete]
  );

  useEffect(() => {
    if (videoId === null) return;

    const mounted = { current: true };
    retryCountRef.current = 0;
    setPercent(0);
    setError(null);

    connect(videoId, mounted);

    return () => {
      mounted.current = false;
      disconnect();
    };
  }, [videoId, connect, disconnect]);

  return { percent, status, error, disconnect };
}

export default useUploadSSE;
