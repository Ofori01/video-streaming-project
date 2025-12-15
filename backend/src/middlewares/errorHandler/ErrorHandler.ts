import type { NextFunction, Request, Response } from "express";
import CustomError from "./errors/CustomError";
import { ValidationError } from "yup";
import multer from "multer";

export const errorHandler = (
  err: Error | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log(err); // ? for debugging
  let statusCode = 500;
  let message = "Internal Server Error";
  let errors: { message: string; field?: string }[] | undefined = undefined;

  if (err instanceof CustomError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
    console.log(err)
  }
  else if (err instanceof ValidationError) {
    // console.error(err);
    statusCode = 400
    message = "Validation failed"
    errors = err.inner.map(e=> ({message: e.errors.join(", "), field: e.path}))
    
  }

  else if (err instanceof multer.MulterError){
    message = "An error occurred while uploading"
    errors = [{message: err.message, field: err.field}]
  }

  // Todo - Add Cast Error (invalid ObjectId, etc.)

  // Todo - Add  Duplicate Key Error

  // JWT Errors
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }
  // Default error
  else {
    message = err.message || message;
  }

  return res.status(statusCode).send({
    success: false,
    message,
    errors,
    // ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
