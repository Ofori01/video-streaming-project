import { useEffect } from "react";
import { Loader2, XCircle, CheckCircle2 } from "lucide-react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { RootState } from "@/store/store";
import {
  clearProcessingTracking,
  setProcessingError,
  updateProcessingPercent,
  updateProcessingStatus,
} from "@/store/uploadProcessing/uploadProcessingSlice";
import useUploadSSE from "@/hooks/use-upload-sse";

const CIRCLE_RADIUS = 22;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

const mapSSEStatus = (
  status: "idle" | "connecting" | "uploading" | "complete" | "error",
) => {
  if (status === "uploading") {
    return "processing" as const;
  }
  return status;
};

const VideoProcessingWidget = () => {
  const dispatch = useDispatch();
  const { activeVideoId, title, storedPercent, storedStatus, storedError } =
    useSelector(
      (state: RootState) => ({
        activeVideoId: state.uploadProcessing.activeVideoId,
        title: state.uploadProcessing.title,
        storedPercent: state.uploadProcessing.percent,
        storedStatus: state.uploadProcessing.status,
        storedError: state.uploadProcessing.error,
      }),
      shallowEqual,
    );

  const { percent, status, error, stageMessage } = useUploadSSE(activeVideoId);

  useEffect(() => {
    if (activeVideoId === null) {
      return;
    }

    const mappedStatus = mapSSEStatus(status);

    if (mappedStatus !== storedStatus) {
      dispatch(updateProcessingStatus(mappedStatus));
    }

    if (percent !== storedPercent) {
      dispatch(updateProcessingPercent(percent));
    }

    if (error && error !== storedError) {
      dispatch(setProcessingError(error));
    }
  }, [
    activeVideoId,
    dispatch,
    error,
    percent,
    status,
    storedError,
    storedPercent,
    storedStatus,
  ]);

  if (activeVideoId === null) {
    return null;
  }

  const progressOffset =
    CIRCLE_CIRCUMFERENCE -
    (Math.max(0, Math.min(storedPercent, 100)) / 100) * CIRCLE_CIRCUMFERENCE;

  return (
    <Card className="fixed bottom-6 right-6 z-50 w-[320px] border-border/80 shadow-xl">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative grid h-16 w-16 place-items-center">
            <svg className="h-16 w-16 -rotate-90" viewBox="0 0 52 52">
              <circle
                cx="26"
                cy="26"
                r={CIRCLE_RADIUS}
                className="stroke-muted"
                strokeWidth="5"
                fill="none"
              />
              <circle
                cx="26"
                cy="26"
                r={CIRCLE_RADIUS}
                className={cn(
                  "transition-all duration-500",
                  storedStatus === "complete"
                    ? "stroke-emerald-500"
                    : "stroke-primary",
                  storedStatus === "error" ? "stroke-destructive" : "",
                )}
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={CIRCLE_CIRCUMFERENCE}
                strokeDashoffset={progressOffset}
              />
            </svg>
            <span className="absolute text-xs font-semibold">
              {storedPercent}%
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              {title ? `${title} (${activeVideoId})` : `Video ${activeVideoId}`}
            </p>
            <p className="text-xs text-muted-foreground">
              {storedStatus === "connecting" &&
                "Connecting to processing stream..."}
              {storedStatus === "processing" &&
                (stageMessage || "Processing video...")}
              {storedStatus === "complete" && "Processing complete"}
              {storedStatus === "error" && (storedError || "Processing failed")}
            </p>
            <div className="mt-2 flex items-center gap-2">
              {storedStatus === "processing" ||
              storedStatus === "connecting" ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              ) : null}
              {storedStatus === "complete" ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : null}
              {storedStatus === "error" ? (
                <XCircle className="h-4 w-4 text-destructive" />
              ) : null}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="ml-auto h-7 text-xs"
                onClick={() => dispatch(clearProcessingTracking())}
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoProcessingWidget;
