import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { BaseEntity } from "../lib/Generics/BaseEntity";
import { VideoEntity } from "./VideoEntity";
import { UserRolesEntity } from "./UserRolesEntity";
import { FileEntity } from "./FilesEntity";

@Entity()
export class UserEntity extends BaseEntity {

  @Column({
    length: 10,
    unique: true
  })
  username: string;

  @Column({
    length: 20,
    unique: true,
  })
  email: string;

  @Column()
  password: string;
 
  @ManyToOne(()=> UserRolesEntity, (role)=>role.users)
  role: UserRolesEntity;


  @OneToOne(()=> FileEntity)
  @JoinColumn()
  profile_picture_url: FileEntity;

  
  @OneToMany(()=> VideoEntity, (video)=> video.uploadedBy)
  uploads: VideoEntity[]
}
