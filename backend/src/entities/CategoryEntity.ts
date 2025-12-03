import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../lib/Generics/BaseEntity";



@Entity()
export class CategoryEntity extends BaseEntity {
    constructor(category?: CategoryEntity){
        super()
        Object.assign(this,category)
    }
    // @PrimaryGeneratedColumn()
    // id: number

    @Column({
        length: 50
    })
    name: string

    @Column({
        length: 100
    })
    description: string
}