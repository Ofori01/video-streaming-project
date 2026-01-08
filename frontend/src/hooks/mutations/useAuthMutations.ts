import authService from "@/backend/auth.Service";
import type { LoginDto, SignUpDto, VerifyOtpDto } from "@/types/dtos/auth";
import type { ApiErrorResponse } from "@/types/errors";
import { useMutation } from "@tanstack/react-query";

interface LoginCredentials {
  email: string;
  password: string;
}

interface VerifyOtpCredentials {
  email: string
  otp: string
}
interface SignUpCredentials {
  email: string;
  password: string;
  username: string
}

export const useLogin = () => {
  return useMutation<LoginDto, ApiErrorResponse, LoginCredentials>({
    mutationFn: (credentials) => authService.login(credentials.email, credentials.password)
  }
);
};

export const useSignUp = () => {
  return useMutation<SignUpDto, ApiErrorResponse,SignUpCredentials>({
    mutationFn: (userData) => authService.signUp(userData.email,userData.username,userData.password)
  })
}



export const useVerifyOtp = () => {
  return useMutation<VerifyOtpDto,ApiErrorResponse,VerifyOtpCredentials>({
    mutationFn: (credentials)=> authService.verifyOtp(credentials.email, credentials.otp)
  })
}
