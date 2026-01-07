import { VerifyOtpDto, VerifyOtpSchema } from './../interfaces/dtos/auth-dtos';
import { OtpRepository } from './../repositories/OtpRepository';
import { OtpService } from './../services/OtpService';
import { Router } from "express";
import { AuthService } from "../services/AuthService";
import { UserRepository } from "../repositories/UserRepository";
import { AuthController } from "../controllers/auth/auth.controller";
import { validate } from "../middlewares/validation/validation";
import { LoginSchema } from "../interfaces/dtos/auth-dtos";
import { UserService } from '../services/UserService';

const authRoutes = Router();

const userRepository = new UserRepository();
const otpRepository = new OtpRepository()
const otpService = new OtpService(otpRepository)
const authService = new AuthService(userRepository, otpService);
const authController = new AuthController(authService,);

authRoutes.post("/login", validate(LoginSchema), authController.login);
authRoutes.post("/verify-otp", validate(VerifyOtpSchema), authController.verifyOtp)

export default authRoutes;
