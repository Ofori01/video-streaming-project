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
import thumbnailUploadQueue from "./worker/thumbnailUploadQueue";
import videoUploadQueue from "./worker/videoUploadQueue";
import mainQueue from "./worker/mainQueue";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { createBullBoard } from "@bull-board/api";
import "./jobs/videoUpload";
import "./jobs/thumbnailUpload";
import "./jobs/mainFlow"

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api", routes);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true }),
);

//bull board
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/ui");
createBullBoard({
  queues: [
    new BullMQAdapter(thumbnailUploadQueue),
    new BullMQAdapter(videoUploadQueue),
    new BullMQAdapter(mainQueue)
  ],
  serverAdapter,
});
app.use("/ui", serverAdapter.getRouter());

app.use(errorHandler);

app.use((req, res: Response) => {
  return res.status(404).send({
    message: "Route not found",
  });
});
//initialize db before server connection
initializeDb().then(() => {
  app.listen(envConfig.PORT, async () => {
    console.log(
      `server started on port ${envConfig.PORT} at http://localhost:${envConfig.PORT}`,
    );
  });
});
