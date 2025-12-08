import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { VideoEntity } from "./VideoEntity";

@Entity()
export class CategoryEntity extends BaseEntity {
  @Column({
    length: 50,
    unique: true,
  })
  name: string;

  @Column({
    length: 100,
  })
  description: string;

  @OneToMany(() => VideoEntity, (video) => video.category)
  videos: VideoEntity[];
}
