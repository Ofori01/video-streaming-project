import { InferType, object, string, number } from "yup";
import { length } from "zod";
import { extend } from "zod/v4/core/util.cjs";
import { id } from "zod/v4/locales";

// export interface LoginDto {
//   email: string;
//   password: string;
// }

const LoginBodySchema = object({
  email: string().email("Invalid email").required("Specify email to login"),
  password: string().required("Please enter your password"),
});

export const LoginSchema = object({
  body:LoginBodySchema
});


 const SignUpBodySchema = object({
  email: string().email("Invalid email").required("Specify a valid email to sign-up"),
  username: string().required("enter a valid username"),
  password: string().required("enter your account password"),
  roleId: string()
})

export const SignUpSchema = object({
  body: SignUpBodySchema
})

 const VerifyOtpBodySchema  = object({
  otp: number().min(100000, "Otp must be 6 digits").max(999999,"Otp must be 6 digits").required("Otp is required"),
  userEmail: string().email("Invalid email").required("Specify a valid email to sign-up"),
  
})

export const VerifyOtpSchema =  object({
  body: VerifyOtpBodySchema
})




export interface SignUpDto extends InferType<typeof SignUpBodySchema>{}
export interface VerifyOtpDto extends InferType<typeof VerifyOtpBodySchema>{}
export interface SignUpDto extends InferType<typeof SignUpBodySchema>{}
export interface LoginDto extends InferType<typeof LoginBodySchema> {}
