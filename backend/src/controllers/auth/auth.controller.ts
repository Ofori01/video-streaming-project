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
      const { user, token } = await this._authService.login(
        req.body.email,
        req.body.password
      );

      return responseHandler.success(res, { user, token }, "Login successful");
    } catch (error) {
      return next(error);
    }
  };
}
