import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { VideoEntity } from "./VideoEntity";
import { UserEntity } from "./UserEntity";

@Entity()
export class CommentEntity extends BaseEntity {
  @ManyToOne(() => VideoEntity)
  video: VideoEntity;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @Column("text")
  content: string;

  @ManyToOne(() => CommentEntity, (comment) => comment.replies)
  parent: CommentEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.parent)
  replies: CommentEntity[];
}
