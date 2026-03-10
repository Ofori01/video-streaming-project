import {  Column, Entity, Index, ManyToMany, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";


@Entity()
export class OtpEntity  extends BaseEntity{

    @Index()
    @Column({
        unique: true,
    })
    otp: number

    // can also just store the email and query for the user
    // @Column()
    // @ManyToOne(()=> UserEntity)
    // user: UserEntity

    @Column()
    @Index()
    userEmail: string

    @Column()
    expiresIn: Date

    @Column({
        default: true
    })
    isActive: boolean
}
