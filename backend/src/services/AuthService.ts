import envConfig from "../config/env.config";
import { IUserRepository } from "../interfaces/repositories/IUserRepository";
import CustomError from "../middlewares/errorHandler/errors/CustomError";
import { NotFoundError } from "../middlewares/errorHandler/errors/NotFoundError";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class AuthService {
  constructor(private _userRepository: IUserRepository) {}

  private generateToken(data: object) {
    return jwt.sign(data, envConfig.JWT_SECRET, { expiresIn: "30d" });
  }

  async login(email: string, password: string) {
    const user = await this._userRepository.GetOne({
      where: { email: email },
      relations: { role: true },select: {
        password: false
      }
    });

    if (!user) {
      throw new NotFoundError("User does not exist ");
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new CustomError("Incorrect password", 400);
    }
    const token = this.generateToken(user);
    return {user, token}
  }
}
