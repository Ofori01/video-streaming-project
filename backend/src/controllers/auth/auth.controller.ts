import { AuthService } from "../../services/AuthService";
import { NextFunction, Request, Response } from "express";
import { LoginDto } from "../../interfaces/dtos/auth-dtos";
import responseHandler from "../../middlewares/responseHandler/responseHandler";

export class AuthController {
  constructor(private _authService: AuthService) {}

  login = async (
    req: Request<{}, {}, LoginDto>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { user } = await this._authService.login(
        req.body.email,
        req.body.password
      );

      return responseHandler.success(res,{}, "Login successful, Verify otp");
    } catch (error) {
      return next(error);
    }
  };
}
