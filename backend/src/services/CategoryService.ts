import { CategoryEntity } from "../entities/CategoryEntity";
import { ICategoryRepository } from "../interfaces/repositories/ICategory";
import { ICategoryService } from "../interfaces/services/ICategoryService";
import { GenericService } from "./GenericService";

export class CategoryService
  extends GenericService<CategoryEntity>
  implements ICategoryService {

    constructor(protected repository: ICategoryRepository){
        super(repository)
    }
  }
