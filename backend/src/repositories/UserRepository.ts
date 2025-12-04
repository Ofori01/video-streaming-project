import { UserEntity } from "../entities/UserEntity";
import { IUserRepository } from "../interfaces/repositories/IUserRepository";
import { GenericRepository } from "./GenericRepository";

export class UserRepository
  extends GenericRepository<UserEntity>
  implements IUserRepository
{
  constructor() {
    const Entity = UserEntity;
    super(Entity);
  }
  //
}
