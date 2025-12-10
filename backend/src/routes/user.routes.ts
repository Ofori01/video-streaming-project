import { UserRolesRepository } from "../repositories/UserRolesRepository";
import { Router } from "express";
import { UserRepository } from "../repositories/UserRepository";
import { UserService } from "../services/UserService";
import { UserController } from "../controllers/user/UserController";
import authMiddleware from "../middlewares/auth/auth.middleware";
import { USER_ROLE } from "../lib/types/common/enums";

const userRoutes = Router();
const userRepository = new UserRepository();
const userRolesRepository = new UserRolesRepository();
const userService = new UserService(userRepository, userRolesRepository);

const userController = new UserController(userService);

userRoutes.use(authMiddleware.authenticate);

userRoutes.post(
  "/create",
  authMiddleware.authorize(USER_ROLE.ADMIN),
  userController.createUser
);
// userRoutes.post("/init", userController.initDb)
userRoutes.get("", userController.GetUsers);

export default userRoutes;
