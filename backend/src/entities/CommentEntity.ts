import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { VideoEntity } from "./VideoEntity";
import { UserEntity } from "./UserEntity";

@Entity()
export class CommentEntity extends BaseEntity {
  @ManyToOne(() => VideoEntity, {nullable: false, onDelete: "CASCADE"})
  video: VideoEntity;

  @ManyToOne(() => UserEntity, {nullable: false, onDelete:"CASCADE"})
  createdBy: UserEntity;

  @Column("text")
  content: string;

  @ManyToOne(() => CommentEntity, (comment) => comment.replies,{nullable: true, onDelete:"CASCADE"})
  parent: CommentEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.parent)
  replies: CommentEntity[];
}
