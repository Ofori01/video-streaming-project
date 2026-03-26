import "reflect-metadata";
import { initializeDb } from "./config/db.config";

const bootstrapWorkers = async () => {
  await initializeDb();

  await Promise.all([
    import("./jobs/videoUpload"),
    import("./jobs/thumbnailUpload"),
    import("./jobs/mainFlow"),
    import("./jobs/uploadSessionCleanup"),
    import("./jobs/deletedVideoCleanup"),
  ]);

  console.log("Background workers started");
};

void bootstrapWorkers().catch((error) => {
  console.error("Failed to start workers", error);
  process.exit(1);
});
