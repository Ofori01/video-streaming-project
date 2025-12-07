import { FindManyOptions } from "typeorm";
import { UserEntity } from "../entities/UserEntity";
import { IUserRepository } from "../interfaces/repositories/IUserRepository";
import { GenericRepository } from "./GenericRepository";
import { USER_ROLE } from "../lib/types/common/enums";

export class UserRepository
  extends GenericRepository<UserEntity>
  implements IUserRepository
{
  constructor() {
    const Entity = UserEntity;
    super(Entity);
  }
  //
  async GetALlByRole(role: string): Promise<UserEntity[]> {
    return await this.repository
      .createQueryBuilder("user")
      .leftJoin("user.role", "role")
      .where("role.name = :name", { name: role }).select([
        'user.id',
        'user.username',
        'user.email',
        'role.name',
        'role.id'
      ])
      .getMany();
  }
}
