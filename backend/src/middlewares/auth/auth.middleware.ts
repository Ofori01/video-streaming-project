import { Jwt } from "./../../../node_modules/@types/jsonwebtoken/index.d";
import { NextFunction, Request, Response } from "express";
import { UserEntity } from "../../entities/UserEntity";
import { UnauthorizedError } from "../errorHandler/errors/UnauthorizedError";
import jwt from "jsonwebtoken";
import envConfig from "../../config/env.config";
import { AuthRequest } from "./AuthRequest";
import { USER_ROLE } from "../../lib/types/common/enums";

class AuthMiddleware {
  private static _instance: AuthMiddleware;
  private constructor() {}

  public static getInstance() {
    if (!AuthMiddleware._instance) {
      AuthMiddleware._instance = new AuthMiddleware();
    }
    return AuthMiddleware._instance;
  }

  //authorization
  authorize = (...roles: USER_ROLE[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const user = req.user;

        if (!user) {
          throw new UnauthorizedError(
            "Invalid token or token expired. Login again"
          );
        }

        if (!roles.includes(user.role.name)) {
          throw new UnauthorizedError("Unauthorized to access this resource");
        }

        next();
      } catch (error) {
        return next(error);
      }
    };
  };

  //authentication
  authentication = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer", "");
      if (!token) {
        throw new UnauthorizedError("Invalid token");
      }
      const user = jwt.verify(token, envConfig.JWT_SECRET) as UserEntity;
      req.user = user;
    } catch (error) {
      next(error);
    }
  };
}

export default AuthMiddleware.getInstance();
