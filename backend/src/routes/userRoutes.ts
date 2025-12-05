import { Router } from "express";
import { UserRepository } from "../repositories/UserRepository";
import { UserService } from "../services/UserService";
import { UserController } from "../controllers/user/UserController";

const userRoutes = Router();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);

const userController = new UserController(userService);

userRoutes.post("/create", userController.createUser.bind(userController));
userRoutes.post("/init", userController.initDb)

export default userRoutes;
