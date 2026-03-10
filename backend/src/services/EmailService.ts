import nodemailer from "nodemailer";
import envConfig from "../config/env.config";
import { ValidationError   } from "yup";
import * as yup from 'yup'
import CustomError from "../middlewares/errorHandler/errors/CustomError";
class EmailService {
  private transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: envConfig.NODEMAILER_USER,
      pass: envConfig.NODEMAILER_USER_PASSWORD
    },
  });
  private async validateEmail(email: string) {
    const emailSchema = yup.string().email("Invalid email address");
    try {
      await emailSchema.validate(email);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new CustomError(error.message);
      }
    }
  }

  async sendEmail(message: string, to: string, subject: string) {
    try {
      //check if email is valid
      await this.validateEmail(to);

      this.transport.sendMail(
        {
          from: envConfig.NODEMAILER_USER,
          to,
          subject,
          text: message,
        },
        (err, data) => {
          if (err) {
            console.log("Error: ", err);
          } else {
            console.log("Email sent successfully: ", data);
          }
        }
      );
    } catch (error) {
      throw error;
    }
  }
}


export default new EmailService()