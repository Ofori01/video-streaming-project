import { Router } from "express";
import { AuthService } from "../services/AuthService";
import { UserRepository } from "../repositories/UserRepository";
import { AuthController } from "../controllers/auth/auth.controller";



const authRoutes = Router()

const userRepository = new UserRepository()
const authService = new AuthService(userRepository)
const authController = new AuthController(authService)


authRoutes.post('/login', authController.login )



export default authRoutes