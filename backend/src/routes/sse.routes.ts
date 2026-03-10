import { Router } from "express";
import { Request, Response } from "express";
import SseManager from "../lib/sse/SseManager";

const sseRoutes = Router();

/**
 * GET /sse/:videoId
 *
 * Establishes an SSE connection for a specific video's upload progress.
 * Authentication is handled by the parent router (authMiddleware.authenticate).
 * The client stays connected, receiving `upload-progress`, `upload-complete`,
 * and `upload-error` events emitted by the BullMQ video upload worker.
 */
sseRoutes.get("/:videoId", (req: Request, res: Response) => {
  const { videoId } = req.params;

  // Register client — sets headers and sends initial `connected` event
  SseManager.addClient(videoId, res);

  // Clean up when the client disconnects
  req.on("close", () => {
    SseManager.removeClient(videoId);
  });
});

export default sseRoutes;
