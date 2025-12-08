import { ICategoryService } from "../../interfaces/services/ICategoryService";
import { NextFunction, Response } from "express";
import { AuthRequest } from "../../middlewares/auth/AuthRequest";
import { CreateCategoryDto } from "../../interfaces/dtos/category-dtos";
import { CategoryEntity } from "../../entities/CategoryEntity";
import responseHandler from "../../middlewares/responseHandler/responseHandler";

export class CategoryController {
  constructor(private _categoryService: ICategoryService) {}

  Create = async (
    req: AuthRequest<{}, {}, CreateCategoryDto>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const category = new CategoryEntity();
      category.description = req.body.description;
      category.name = req.body.name;
      const createdCategory = await this._categoryService.Create(category);
      return responseHandler.created(
        res,
        createdCategory,
        "Category created Successfully"
      );
    } catch (error) {
      return next(error);
    }
  };
  GetAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const categories = await this._categoryService.GetAll()
        return responseHandler.success(res,categories)
    } catch (error) {
        return next(error)
    }
  }
}
