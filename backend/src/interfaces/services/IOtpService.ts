import { OtpEntity } from "../../entities/OtpEntity";
import { IGenericService } from "./IGenericService";



export interface IOtpService extends IGenericService<OtpEntity> {

    //additional 
    HandleOtpDelivery: ( deliverTo: string, otp: string, expiresIn: number)=> void

}   