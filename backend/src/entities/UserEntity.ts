import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { USER_ROLE } from "../lib/types/common/enums";
import { BaseEntity } from "../lib/Generics/BaseEntity";

@Entity()
export class UserEntity extends BaseEntity {
  // @PrimaryGeneratedColumn()
  // id: number;
  constructor(user?: UserEntity){
    super()
    Object.assign(this, user)
  }

  @Column({
    length: 10,
  })
  username: string;

  @Column({
    length: 20,
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    type: "enum",
    enum: USER_ROLE,
    default: USER_ROLE.user
  })
  role: USER_ROLE;

  @Column()
  profile_picture_url: string;

  // @CreateDateColumn()
  // createdAt: Date;

  // @UpdateDateColumn()
  // updatedAt: Date;
}
