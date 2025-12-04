import { Column, Entity, ManyToOne, OneToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { FILE_TYPE } from "../lib/types/common/enums";
import { VideoEntity } from "./VideoEntity";
import { UserEntity } from "./UserEntity";

@Entity()
export class FileEntity extends BaseEntity {
  @Column()
  url: string;

  @Column({
    type: "enum",
    enum: FILE_TYPE,
  })
  type: FILE_TYPE;

  @ManyToOne(() => VideoEntity, (video) => video.files, { nullable: true })
  video: VideoEntity;
}
