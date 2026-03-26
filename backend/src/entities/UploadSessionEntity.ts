import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { UserEntity } from "./UserEntity";
import { UPLOAD_SESSION_STATUS } from "../lib/types/common/enums";

@Entity()
export class UploadSessionEntity extends BaseEntity {
  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @Column({
    type: "enum",
    enum: UPLOAD_SESSION_STATUS,
    default: UPLOAD_SESSION_STATUS.INITIATED,
  })
  status: UPLOAD_SESSION_STATUS;

  @Column()
  expiresAt: Date;

  @Column()
  videoTempKey: string;

  @Column()
  thumbnailTempKey: string;

  @Column()
  videoFinalKey: string;

  @Column()
  thumbnailFinalKey: string;

  @Column()
  videoExpectedMimeType: string;

  @Column({ type: "bigint" })
  videoExpectedSize: string;

  @Column()
  thumbnailExpectedMimeType: string;

  @Column({ type: "bigint" })
  thumbnailExpectedSize: string;

  @Column({ nullable: true })
  videoUploadedAt: Date;

  @Column({ nullable: true })
  thumbnailUploadedAt: Date;

  @Column({ nullable: true })
  finalizedAt: Date;
}
