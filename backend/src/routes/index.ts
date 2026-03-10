import { Router } from "express";
import userRoutes from "./user.routes";
import authRoutes from "./auth.routes";
import categoryRoutes from "./category.routes";
import videoRoutes from "./video.routes";
import sseRoutes from "./sse.routes";
import commentRoutes from "./comments.routes";
import authMiddleware from "../middlewares/auth/auth.middleware";

const routes = Router();

routes.use("/user", userRoutes);

routes.use("/auth", authRoutes);

routes.use("/category", categoryRoutes);

routes.use("/video", videoRoutes);

routes.use("/comments", commentRoutes);

routes.use("/sse", authMiddleware.authenticate, sseRoutes);

export default routes;
