import { OtpEntity } from "../../entities/OtpEntity";
import { GenericRepository } from "../../repositories/GenericRepository";
import { IGenericRepository } from "./IGenericRepository";


export interface IOtpRepository extends IGenericRepository<OtpEntity> {

}