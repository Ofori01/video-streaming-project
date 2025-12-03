import { UserEntity } from "../../entities/UserEntity";
import { IGenericService } from "./IGenericService";



export interface IUserService extends IGenericService<UserEntity> {
    
    //! define custom user service methods
}