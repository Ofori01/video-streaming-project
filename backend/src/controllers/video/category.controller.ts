import { ICategoryService } from "../../interfaces/services/ICategoryService";
import { NextFunction, Response } from "express";
import { AuthRequest } from "../../middlewares/auth/AuthRequest";

export class CategoryController {

    constructor(private _categoryService: ICategoryService){}

    Create = async (req: AuthRequest, res: Response, next: NextFunction ) => {
        try {
              
        } catch (error) {
            return next(error)
        }
    }
}