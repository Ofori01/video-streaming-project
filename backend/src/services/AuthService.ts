import envConfig from "../config/env.config";
import { UserEntity } from "../entities/UserEntity";
import { IUserRepository } from "../interfaces/repositories/IUserRepository";
import CustomError from "../middlewares/errorHandler/errors/CustomError";
import { NotFoundError } from "../middlewares/errorHandler/errors/NotFoundError";
import bcrypt from "bcryptjs";
import crypto from 'crypto'
import jwt from "jsonwebtoken";
import EmailService from "./EmailService";
import { IOtpRepository } from "../interfaces/repositories/IOtpRepository";
import { th } from "zod/v4/locales";
import { OtpEntity } from "../entities/OtpEntity";
import { IOtpService } from "../interfaces/services/IOtpService";

export class AuthService {
  constructor(private _userRepository: IUserRepository, private _otpService: IOtpService) {}

  private generateToken(data: object) {
    return jwt.sign(data, envConfig.JWT_SECRET, { expiresIn: "30d" });
  }

  private async generateOtp(userEmail: string){
    // generate actual otp code ~ 6 digits
    const otp = crypto.randomInt(100000, 1000000); 


    const expires = new Date()
    expires.setMinutes(expires.getMinutes() + 15)

    const newOtp = new OtpEntity()
    newOtp.userEmail = userEmail
    newOtp.otp = otp
    newOtp.expiresIn = expires
    await this._otpService.Create(newOtp)
    return {otp: newOtp.otp, expiresIn: expires.getMinutes() }
  }

  async login(email: string, password: string) {
    const user = await this._userRepository.GetOne({
      where: { email: email },
      relations: { role: true },select: {
        id: true,
        email: true,
        username: true,
        password: true
      }
    });

    if (!user) {
      throw new NotFoundError("User does not exist");
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new CustomError("Incorrect password", 400);
    }
    //TODO - use in auth request type instead of userEntity

    const {otp, expiresIn } =  await this.generateOtp(user.email)
    this._otpService.HandleOtpDelivery(user.email, otp.toString(), expiresIn)

    // const payload = {
    //   id: user.id,
    //   email: user.email,
    //   username: user.username,
    //   role: user.role?.name ??  'user'
    // }
    // const token = this.generateToken(payload);
    return {user}
  }


  async VerifyOtp(){

  }
  
}
