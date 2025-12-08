import { CategoryEntity } from "../../entities/CategoryEntity";
import { IGenericRepository } from "./IGenericRepository";



export interface ICategoryRepository extends IGenericRepository<CategoryEntity>{


    //additional
    // GetVideos(category: CategoryEntity): Promise<CategoryEntity[]>
}