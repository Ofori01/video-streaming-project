import { Jwt } from "./../../../node_modules/@types/jsonwebtoken/index.d";
import { NextFunction, Request, Response } from "express";
import { UserEntity } from "../../entities/UserEntity";
import { UnauthorizedError } from "../errorHandler/errors/UnauthorizedError";
import jwt from "jsonwebtoken";
import envConfig from "../../config/env.config";
import { AuthRequest } from "./AuthRequest";

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

  //authentication
  authentication = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer", "");
      if (!token) {
        throw new UnauthorizedError("Invalid token");
      }
      const user = jwt.verify(token, envConfig.JWT_SECRET) as UserEntity;
      req.user = user
    } catch (error) {
      next(error);
    }
  };
}

export default AuthMiddleware.getInstance();
