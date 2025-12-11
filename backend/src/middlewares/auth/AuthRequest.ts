import { Request } from "express";
import { TokenContent } from "../../interfaces/common/tokenContent";

export interface AuthRequest<
  P = object,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> extends Request<P, ResBody, ReqBody, ReqQuery> {
    user? : TokenContent
}