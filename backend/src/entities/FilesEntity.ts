import { Column, Entity } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { FILE_TYPE } from "../lib/types/common/enums";

@Entity()
export class FileEntity extends BaseEntity {
  @Column()
  url: string;

  @Column({
    type: "enum",
    enum: FILE_TYPE,
  })
  type: FILE_TYPE;
  
}
