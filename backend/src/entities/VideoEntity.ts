import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { UPLOAD_STATUS, VIDEO_STATUS } from "../lib/types/common/enums";
import { BaseEntity } from "./BaseEntity";
import { FileEntity } from "./FilesEntity";
import { CategoryEntity } from "./CategoryEntity";
import { UserEntity } from "./UserEntity";

@Entity()
export class VideoEntity extends BaseEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(()=> FileEntity)
  thumbnail: FileEntity

  @ManyToOne(()=> FileEntity)
  video: FileEntity
  

  @ManyToOne(() => CategoryEntity, (category) => category.videos)
  category: CategoryEntity;

  @ManyToOne(() => UserEntity)
  uploadedBy: UserEntity;

  @Column({
    type: "float",
    nullable: true
  })
  duration: number;

  @Column({nullable: true})
  processingError: string;

  @Column({
    enum: VIDEO_STATUS,
    default: VIDEO_STATUS.ARCHIVED
  })
  status: VIDEO_STATUS;

  @Column({
    enum: UPLOAD_STATUS,
    default: UPLOAD_STATUS.PENDING,
  })
  processingStatus: UPLOAD_STATUS;
}
