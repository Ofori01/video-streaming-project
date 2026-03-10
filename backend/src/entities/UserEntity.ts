import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { VideoEntity } from "./VideoEntity";
import { UserRolesEntity } from "./UserRolesEntity";
import { FileEntity } from "./FilesEntity";

@Entity()
export class UserEntity extends BaseEntity {
  @Column({
    length: 10,
    unique: true,
  })
  username: string;

  @Column({
    unique: true,
    nullable: true
  })
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => UserRolesEntity, (role) => role.users)
  role: UserRolesEntity;

  @OneToOne(() => FileEntity, {nullable: true})
  @JoinColumn()
  profile_picture_url: FileEntity;
  

  
}
