import { UserEntity } from "../../entities/UserEntity";
import { IGenericRepository } from "./IGenericRepository";



export interface IUserRepository extends IGenericRepository<UserEntity>{

    //! add user repo types
    GetALlByRole(role: string): Promise<UserEntity[]>

}