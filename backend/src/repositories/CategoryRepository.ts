import { CategoryEntity } from "../entities/CategoryEntity";
import { ICategoryRepository } from "../interfaces/repositories/ICategory";
import { GenericRepository } from "./GenericRepository";



export class CategoryRepository extends GenericRepository<CategoryEntity> implements ICategoryRepository {

    constructor(){
        super(CategoryEntity)
    }
}