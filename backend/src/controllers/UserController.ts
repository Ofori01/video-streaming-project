import { UserService } from "../services/UserService";
import type { NextFunction, Request, Response } from "express";



export class UserController {

    constructor(private _userService: UserService){}


    //create user
    createUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            
        } catch (error) {
            
        }
    }
}