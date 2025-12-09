import { Router } from "express";
import userRoutes from "./user.routes";
import authRoutes from "./auth.routes";
import categoryRoutes from "./category.routes";
import videoRoutes from "./video.routes";

const routes = Router();

routes.use("/user", userRoutes);

routes.use("/auth", authRoutes);

routes.use('/category', categoryRoutes)

routes.use('/video', videoRoutes)
export default routes;
