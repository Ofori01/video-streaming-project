import { AuthService } from "../../services/AuthService";
import { NextFunction, Request, Response } from "express";
import { LoginDto, SignUpDto, VerifyOtpDto } from "../../interfaces/dtos/auth-dtos";
import responseHandler from "../../middlewares/responseHandler/responseHandler";

export class AuthController {
  constructor(
    private _authService: AuthService,
  ) {}

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

      return responseHandler.success(res, user, "Login successful, Verify otp");
    } catch (error) {
      return next(error);
    }
  };

  signUp = async (req: Request<{},{}, SignUpDto>, res: Response, next: NextFunction) => {
    try {
      const {user, token} = await this._authService.signUp(req.body.username, req.body.password,req.body.email)

      return responseHandler.success(res,{user, token}, "Sign up successful")
    } catch (error) {
      return next(error)
      
    }
  };

  verifyOtp = async (
    req: Request<{}, {}, VerifyOtpDto>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this._authService.VerifyOtp(req.body.otp, req.body.userEmail);

      
      const {token, user}  = await this._authService.generateUserToken(req.body.userEmail)

      return responseHandler.success(res, {token, user},"Login successful")
    } catch (error) {
      return next(error);
    }
  };
}
