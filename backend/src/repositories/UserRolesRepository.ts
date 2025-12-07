import { Repository } from "typeorm";
import { UserRolesEntity } from "../entities/UserRolesEntity";
import { IUserRolesRepository } from "../interfaces/repositories/IUserRolesRepository";
import { GenericRepository } from "./GenericRepository";
import { USER_ROLE } from "../lib/types/common/enums";

export class UserRolesRepository
  extends GenericRepository<UserRolesEntity>
  implements IUserRolesRepository
{
  constructor() {
    super(UserRolesEntity);
  }

  async GetUsers(role: USER_ROLE): Promise<UserRolesEntity> {
    console.log(role)
    const roleWithUsers = await this.repository
      .createQueryBuilder("role")
      .leftJoinAndSelect("role.users", "user")
      .where("role.name = :name", { name: role })
      .select([
        "role.id",
        "role.name",
        "user.id",
        "user.username",
        "user.email",
      ])
      .getOneOrFail();

    return roleWithUsers;
  }
}
