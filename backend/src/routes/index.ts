import { Router } from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./auth.routes";




const routes  = Router()


routes.use("/user", userRoutes)

routes.use("/auth", authRoutes)



export default routes 