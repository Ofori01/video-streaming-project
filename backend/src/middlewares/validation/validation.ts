import { Schema } from "yup";
import { AuthRequest } from "../auth/AuthRequest";
import { NextFunction, Response } from "express";

export const validate =  (schema: Schema) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        await schema.validate({
            body: req.body,
            params: req.params,
            query: req.query
        }, {abortEarly: false})
        return next()
    } catch (error : any) {
        next(error)
    }
  };
};
