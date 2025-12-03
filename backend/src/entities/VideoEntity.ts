import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { VIDEO_STATUS } from "../lib/types/common/enums";
import { BaseEntity } from "../lib/Generics/BaseEntity";

@Entity()
export class VideoEntity extends BaseEntity {
  // @PrimaryGeneratedColumn()
  // id: number;

  constructor() {
    super();
  }

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  video_url: string;

  @Column()
  thumbnail_url: string;

  @Column()
  category: string;

  //foreign key
  @Column()
  uploaded_by: string;

  @Column()
  views: number;

  @Column({
    type: "float",
  })
  duration: number;

  @Column()
  status: VIDEO_STATUS;
}
