import { Resend } from "resend";
import nodemailer from "nodemailer";
import envConfig from "../config/env.config";
import { ValidationError } from "yup";
import * as yup from "yup";
import CustomError from "../middlewares/errorHandler/errors/CustomError";

type EmailProvider = "resend" | "nodemailer";

// Switch here to change provider. Nodemailer is disabled by default
const ACTIVE_PROVIDER: EmailProvider = "resend";

class EmailService {
  private resend = new Resend(envConfig.RESEND_API_KEY);

  // Nodemailer transport — kept for local/self-hosted use.
  // Set ACTIVE_PROVIDER to "nodemailer" and supply NODEMAILER_USER +
  // NODEMAILER_USER_PASSWORD env vars to re-enable.
  private nodemailerTransport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: envConfig.NODEMAILER_USER ?? "",
      pass: envConfig.NODEMAILER_USER_PASSWORD ?? "",
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

  private async sendViaResend(
    message: string,
    to: string,
    subject: string,
  ): Promise<void> {
    const { error } = await this.resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject,
      text: message,
    });
    if (error) {
      console.error("Resend error:", error);
      throw new CustomError(error.message);
    }
    console.log(`Email sent via Resend to ${to}`);
  }

  private sendViaNodemailer(
    message: string,
    to: string,
    subject: string,
  ): void {
    this.nodemailerTransport.sendMail(
      {
        from: envConfig.NODEMAILER_USER,
        to,
        subject,
        text: message,
      },
      (err, data) => {
        if (err) {
          console.error("Nodemailer error:", err);
        } else {
          console.log("Email sent via Nodemailer:", data.messageId);
        }
      },
    );
  }

  async sendEmail(message: string, to: string, subject: string): Promise<void> {
    await this.validateEmail(to);

    if (ACTIVE_PROVIDER === "resend") {
      await this.sendViaResend(message, to, subject);
    } else {
      this.sendViaNodemailer(message, to, subject);
    }
  }
}

export default new EmailService();
