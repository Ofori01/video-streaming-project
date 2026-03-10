import { IOtpRepository } from "../interfaces/repositories/IOtpRepository";
import { GenericService } from "./GenericService";
import { OtpEntity } from "../entities/OtpEntity";
import { IOtpService } from "../interfaces/services/IOtpService";
import EmailService from "./EmailService";
import CustomError from "../middlewares/errorHandler/errors/CustomError";

export class OtpService
  extends GenericService<OtpEntity>
  implements IOtpService
{
  constructor(protected otpRepository: IOtpRepository) {
    super(otpRepository);
  }

  HandleOtpDelivery = async (deliverTo: string, otp: string, expiresIn: number) => {
    // send email with token
    try {
      await EmailService.sendEmail(`${otp}. This will expire in ${expiresIn} minutes`, deliverTo, "OTP VERIFICATION");
    } catch (error) {
      throw new CustomError("Error generating token, try again later", 500)
    }
  };
}
