import authService from "@/backend/auth.Service";
import type { LoginDto } from "@/types/dtos/auth";
import type { ApiErrorResponse } from "@/types/errors";
import { useMutation } from "@tanstack/react-query";

interface LoginCredentials {
  email: string;
  password: string;
}

export const useLogin = () => {
  return useMutation<LoginDto, ApiErrorResponse, LoginCredentials>({
    mutationFn: (credentials) => authService.login(credentials.email, credentials.password),
    onError: (err)=> console.log(err)
  }
);
  
};
