import { InferType, object, string } from "yup";

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

export interface LoginDto extends InferType<typeof LoginBodySchema> {}
