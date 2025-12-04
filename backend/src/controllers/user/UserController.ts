import { UserService } from "../../services/UserService";
import {
  response,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { createUserDto } from "./user-dtos";
import { UserEntity } from "../../entities/UserEntity";

export class UserController {
  constructor(private _userService: UserService) {}

  //create user
  createUser = async (
    req: Request<{}, {}, createUserDto>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const newUser = await this._userService
        .Create
        // new UserEntity(req.body as UserEntity)
        ();
      res.status(201).send({
        message: "User created successfully",
        data: newUser,
      });
    } catch (error) {
      console.log(error);
    }
  };
}
