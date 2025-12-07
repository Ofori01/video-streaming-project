import CustomError from "./CustomError";

export class BadRequestError extends CustomError {
  constructor(
    message: string,
    errors?: { message: string; field?: string }[] | undefined
  ) {
    super(message,400, errors)
  }
  name = "BadRequestError"
}
