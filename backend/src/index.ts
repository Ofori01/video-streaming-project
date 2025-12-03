import "reflect-metadata";
import express from "express";
import { initializeDb } from "./config/db.config";
import routes from "./routes";

const app = express();

const PORT = 5000;

app.use(express.json());

app.use("/api", routes)

app.listen(PORT, async () => {
  console.log(`server started on port ${PORT}`);
  await initializeDb();
});
