import { Router } from "express";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { CategoryService } from "../services/CategoryService";
import { CategoryController } from "../controllers/video/category.controller";
import authMiddleware from "../middlewares/auth/auth.middleware";
import { USER_ROLE } from "../lib/types/common/enums";

const categoryRoutes = Router();

const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

categoryRoutes.use(authMiddleware.authenticate);

categoryRoutes.post(
  "",
  authMiddleware.authorize(USER_ROLE.ADMIN),
  categoryController.Create
);
categoryRoutes.get("", categoryController.GetAll);

export default categoryRoutes;
