import { UserEntity } from "../entities/UserEntity";
import { IUserRepository } from "../interfaces/repositories/IUserRepository";
import { IUserService } from "../interfaces/services/IUserService";
import { GenericService } from "./GenericService";

export class UserService
  extends GenericService<UserEntity>
  implements IUserService {

    constructor(protected repository: IUserRepository){
        super(repository)
    }
  }
