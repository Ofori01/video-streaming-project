import envConfig from "../config/env.config";
import { UserEntity } from "../entities/UserEntity";
import { IUserRepository } from "../interfaces/repositories/IUserRepository";
import CustomError from "../middlewares/errorHandler/errors/CustomError";
import { NotFoundError } from "../middlewares/errorHandler/errors/NotFoundError";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { OtpEntity } from "../entities/OtpEntity";
import { IOtpService } from "../interfaces/services/IOtpService";
import { IUserRolesRepository } from "../interfaces/repositories/IUserRolesRepository";
import { USER_ROLE } from "../lib/types/common/enums";
import { email } from "zod";

export class AuthService {
  constructor(
    private _userRepository: IUserRepository,
    private _otpService: IOtpService,
    private _userRolesRepository: IUserRolesRepository
  ) {}

  // private generateToken(data: object) {
  //   return jwt.sign(data, envConfig.JWT_SECRET, { expiresIn: "30d" });
  // }

  async generateUserToken(userEmail: string) {
    const user = await this._userRepository.GetOne({
      where: { email: userEmail },
      relations: {role: true},
      select: {
        role: {
          id: true,
          name: true,
        }
      }
    });
    if (!user) {
      throw new NotFoundError("User not found");
    }
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role?.name ??  'user'
    };
    const token =  jwt.sign(payload,envConfig.JWT_SECRET, {expiresIn: "2d"})
    return {token , user: payload}
  }

  private async generateOtp(userEmail: string) {
    // generate actual otp code ~ 6 digits
    const otp = crypto.randomInt(100000, 1000000);

    const expiryTime = 15;
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + expiryTime);

    const newOtp = new OtpEntity();
    newOtp.userEmail = userEmail;
    newOtp.otp = otp;
    newOtp.expiresIn = expires;
    await this._otpService.Create(newOtp);
    return { otp: newOtp.otp, expiresIn: expiryTime };
  }

  async login(email: string, password: string) {
    const user = await this._userRepository.GetOne({
      where: { email: email },
      relations: { role: true },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
      },
    });

    if (!user) {
      throw new NotFoundError("User does not exist");
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new CustomError("Incorrect password", 400);
    }
    //TODO - use in auth request type instead of userEntity

    const { otp, expiresIn } = await this.generateOtp(user.email);
    this._otpService.HandleOtpDelivery(user.email, otp.toString(), expiresIn);

    // const payload = {
    //   id: user.id,
    //   email: user.email,
    //   username: user.username,
    //   role: user.role?.name ??  'user'
    // }
    // const token = this.generateToken(payload);
    return { user: { id: user.id, email: user.email } };
  }

  // Todo -
  async VerifyOtp(otp: number, userEmail: string) {
    const fetchedOtp = await this._otpService.GetOne({
      where: { otp: otp, userEmail, isActive: true },
    });
    if (!fetchedOtp) {
      throw new CustomError("Invalid Otp", 400);
    }
    // check expiry
    if (new Date() > fetchedOtp.expiresIn) {
      throw new CustomError("OTP has expired. Try again later", 400);
    }

    //otp is accurate
    fetchedOtp.isActive = false;

    //for first time users -> after signup,
    const user = await this._userRepository.GetOne({where: {email: userEmail}})
    if(!user){
      throw new CustomError("An error occurred while trying to verify otp. Try again later")
    }
    user.isEmailVerified = true

    await Promise.all([
       this._otpService.Update(fetchedOtp.id, fetchedOtp),
       this._userRepository.Update(user.id, user)

    ])
  }

  async signUp (username: string, password: string, email: string){
    // check existing user
    const existingUser = await this._userRepository.GetOne({where: {email}})
    if(existingUser){
      throw new CustomError("The email already exists, did you mean to log in?", 400)
    }

    // get user role
    const userRole = await this._userRolesRepository.GetOne({where: {name: USER_ROLE.USER}})
    //if no role -> consider
    if(!userRole){
      throw new CustomError("An error occurred during sign-up. Try again later")
    }


    const newUser  = new UserEntity()
    newUser.email = email
    newUser.password = bcrypt.hashSync(password)
    newUser.username = username
    newUser.role = userRole

    await this._userRepository.Create(newUser)
    const { otp, expiresIn } = await this.generateOtp(newUser.email);
    this._otpService.HandleOtpDelivery(newUser.email, otp.toString(), expiresIn);
    return {id: newUser.id, email: newUser.email}
  }
}
