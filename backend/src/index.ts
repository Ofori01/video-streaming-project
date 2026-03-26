import "reflect-metadata";
import express, { Response } from "express";
import { initializeDb } from "./config/db.config";
import routes from "./routes";
import { errorHandler } from "./middlewares/errorHandler/ErrorHandler";
import envConfig from "./config/env.config";
import * as swaggerUi from "swagger-ui-express";
import specs from "./config/swagger.config";
import morgan from "morgan";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: envConfig.FRONTEND_URL === "*" ? "*" : envConfig.FRONTEND_URL,
    credentials: envConfig.FRONTEND_URL !== "*",
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api", routes);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true }),
);

app.use(errorHandler);

app.use((req, res: Response) => {
  return res.status(404).send({
    message: "Route not found",
  });
});

const setupBullBoard = async () => {
  const [
    { BullMQAdapter },
    { ExpressAdapter },
    { createBullBoard },
    { default: thumbnailUploadQueue },
    { default: videoUploadQueue },
    { default: mainQueue },
    { cleanupQueue },
    { deletedVideoCleanupQueue },
  ] = await Promise.all([
    import("@bull-board/api/bullMQAdapter"),
    import("@bull-board/express"),
    import("@bull-board/api"),
    import("./worker/thumbnailUploadQueue"),
    import("./worker/videoUploadQueue"),
    import("./worker/mainQueue"),
    import("./jobs/uploadSessionCleanup"),
    import("./jobs/deletedVideoCleanup"),
  ]);

  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath("/ui");
  createBullBoard({
    queues: [
      new BullMQAdapter(thumbnailUploadQueue),
      new BullMQAdapter(videoUploadQueue),
      new BullMQAdapter(mainQueue),
      new BullMQAdapter(cleanupQueue),
      new BullMQAdapter(deletedVideoCleanupQueue),
    ],
    serverAdapter,
  });

  app.use("/ui", serverAdapter.getRouter());
};

const setupWorkers = async () => {
  const workerImports: Array<Promise<unknown>> = [];

  if (envConfig.ENABLE_VIDEO_UPLOAD_WORKER === "true") {
    workerImports.push(import("./jobs/videoUpload"));
  }

  if (envConfig.ENABLE_MAIN_FLOW_WORKER === "true") {
    workerImports.push(import("./jobs/mainFlow"));
  }

  if (envConfig.ENABLE_THUMBNAIL_UPLOAD_WORKER === "true") {
    workerImports.push(import("./jobs/thumbnailUpload"));
  }

  if (envConfig.ENABLE_UPLOAD_SESSION_CLEANUP_WORKER === "true") {
    workerImports.push(import("./jobs/uploadSessionCleanup"));
  }

  if (envConfig.ENABLE_DELETED_VIDEO_CLEANUP_WORKER === "true") {
    workerImports.push(import("./jobs/deletedVideoCleanup"));
  }

  await Promise.all(workerImports);
};

//initialize db before server connection
initializeDb().then(() => {
  void setupWorkers();

  if (envConfig.ENABLE_BULL_BOARD === "true") {
    void setupBullBoard();
  }

  app.listen(envConfig.PORT, async () => {
    console.log(
      `server started on port ${envConfig.PORT} at http://localhost:${envConfig.PORT}`,
    );
  });
});
