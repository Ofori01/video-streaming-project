import { UserRolesRepository } from './../repositories/UserRolesRepository';
import { UserEntity } from "../entities/UserEntity";
import { UserRolesEntity } from "../entities/UserRolesEntity";
import { IUserRepository } from "../interfaces/repositories/IUserRepository";
import { IUserService } from "../interfaces/services/IUserService";
import { USER_ROLE } from "../lib/types/common/enums";
import { GenericService } from "./GenericService";
import { IUserRolesRepository } from '../interfaces/repositories/IUserRolesRepository';

export class UserService
  extends GenericService<UserEntity>
  implements IUserService {

    constructor(
      protected repository: IUserRepository, private UserRolesRepository: IUserRolesRepository){
        super(repository)
    }


    //
    async GetRoleUsers(role: USER_ROLE): Promise<UserEntity[]> {
      // return  await this.UserRolesRepository.GetUsers(role)
      return await this.repository.GetALlByRole(role)
    }

    
  }
