import { OtpEntity } from "../entities/OtpEntity";
import { IOtpRepository } from "../interfaces/repositories/IOtpRepository";
import { GenericRepository } from "./GenericRepository";


export class OtpRepository extends GenericRepository<OtpEntity> implements IOtpRepository{
    constructor(){
        super(OtpEntity)
    }

}