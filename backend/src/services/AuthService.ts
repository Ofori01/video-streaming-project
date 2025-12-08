import envConfig from "../config/env.config";
import { UserEntity } from "../entities/UserEntity";
import { IUserRepository } from "../interfaces/repositories/IUserRepository";
import CustomError from "../middlewares/errorHandler/errors/CustomError";
import { NotFoundError } from "../middlewares/errorHandler/errors/NotFoundError";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService {
  constructor(private _userRepository: IUserRepository) {}

  private generateToken(data: object) {
    return jwt.sign(data, envConfig.JWT_SECRET, { expiresIn: "30d" });
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
      throw new NotFoundError("User does not exist ");
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new CustomError("Incorrect password", 400);
    }
    //TODO - use in auth request type instead of userEntity
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role?.name ??  'user'
    }
    const token = this.generateToken(payload);
    return {user, token}
  }
}
