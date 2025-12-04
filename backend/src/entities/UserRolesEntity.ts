import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { USER_ROLE } from "../lib/types/common/enums";
import { UserEntity } from "./UserEntity";

@Entity()
export class UserRolesEntity extends BaseEntity {
  @Column({
    type: "enum",
    enum: USER_ROLE,
    default: USER_ROLE.user,
  })
  name: USER_ROLE;

  @Column({
    type: "varchar",
    length: "30",
  })
  description: string;

  @OneToMany(() => UserEntity, (user) => user.role)
  users: UserEntity[];
}
