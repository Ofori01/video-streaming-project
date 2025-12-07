import { UserRolesRepository } from './../repositories/UserRolesRepository';
import { Router } from "express";
import { UserRepository } from "../repositories/UserRepository";
import { UserService } from "../services/UserService";
import { UserController } from "../controllers/user/UserController";

const userRoutes = Router();
const userRepository = new UserRepository();
const userRolesRepository = new UserRolesRepository()
const userService = new UserService(userRepository, userRolesRepository);

const userController = new UserController(userService);

userRoutes.post("/create", userController.createUser);
// userRoutes.post("/init", userController.initDb)
userRoutes.get('', userController.GetUsers)

export default userRoutes;
