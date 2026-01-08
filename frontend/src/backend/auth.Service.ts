import type { LoginDto, VerifyOtpDto } from "@/types/dtos/auth"
import backendService from "./api.service"
import { endpoints } from "./constants"



class AuthService {

   async login(email: string, password: string){
    const response = await backendService.post<LoginDto>(endpoints.login,{email, password})
    return response.data
   } 

   async verifyOtp(email:string, otp: string){
      const response =  await backendService.post<VerifyOtpDto>(endpoints.verifyOtp, {userEmail: email, otp})
      return response.data
      
   }
}


export default new AuthService()
// login

//logout

