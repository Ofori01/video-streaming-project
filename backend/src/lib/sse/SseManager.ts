import { Response } from "express";

interface SseClient {
  res: Response;
  heartbeatInterval: ReturnType<typeof setInterval>;
}

class SseManager {
  private static _instance: SseManager;
  private _clients: Map<string, SseClient> = new Map();

  private constructor() {}

  public static getInstance(): SseManager {
    if (!SseManager._instance) {
      SseManager._instance = new SseManager();
    }
    return SseManager._instance;
  }

  /**
   * Register an SSE client for a given videoId.
   * Sets the required SSE response headers, sends an initial `connected` event,
   * and starts a 30-second heartbeat comment to prevent proxy/firewall timeouts.
   */
  public addClient(videoId: string, res: Response): void {
    // Clean up any stale connection for this videoId
    if (this._clients.has(videoId)) {
      this.removeClient(videoId);
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no"); // Disable nginx buffering

    // Send connected event
    res.write(`event: connected\n`);
    res.write(`data: ${JSON.stringify({ videoId })}\n\n`);

    // Heartbeat every 30 seconds to keep connection alive through proxies
    const heartbeatInterval = setInterval(() => {
      try {
        res.write(`: heartbeat\n\n`);
      } catch {
        this.removeClient(videoId);
      }
    }, 30_000);

    this._clients.set(videoId, { res, heartbeatInterval });
    console.log(`[SSE] Client connected for videoId=${videoId}. Total: ${this._clients.size}`);
  }

  /**
   * Remove a client and stop its heartbeat.
   */
  public removeClient(videoId: string): void {
    const client = this._clients.get(videoId);
    if (client) {
      clearInterval(client.heartbeatInterval);
      this._clients.delete(videoId);
      console.log(`[SSE] Client disconnected for videoId=${videoId}. Total: ${this._clients.size}`);
    }
  }

  /**
   * Send an SSE event to a specific client by videoId.
   * Silently removes the client if the write fails (connection already closed).
   */
  public sendToClient(videoId: string, eventType: string, data: unknown): void {
    const client = this._clients.get(videoId);
    if (!client) return;

    try {
      const message = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
      client.res.write(message);
    } catch (err) {
      console.error(`[SSE] Failed to send to videoId=${videoId}:`, err);
      this.removeClient(videoId);
    }
  }

  public hasClient(videoId: string): boolean {
    return this._clients.has(videoId);
  }
}

export default SseManager.getInstance();
