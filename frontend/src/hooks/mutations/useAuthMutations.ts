import authService from "@/backend/auth.Service";
import type { LoginDto, VerifyOtpDto } from "@/types/dtos/auth";
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

export const useLogin = () => {
  return useMutation<LoginDto, ApiErrorResponse, LoginCredentials>({
    mutationFn: (credentials) => authService.login(credentials.email, credentials.password)
  }
);
};

export const useVerifyOtp = () => {
  return useMutation<VerifyOtpDto,ApiErrorResponse,VerifyOtpCredentials>({
    mutationFn: (credentials)=> authService.verifyOtp(credentials.email, credentials.otp)
  })
}
