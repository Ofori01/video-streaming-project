import type { AvailableRolesDto, LoginDto, SignUpDto, VerifyOtpDto } from "@/types/dtos/auth"
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

   async signUp(email:string, username: string, password: string, role?: string){
      const response = await backendService.post<SignUpDto>(endpoints.signUp, {email, password,username, roleId: role})
      return response.data
   }

   async getAvailableRoles(){
      const response = await backendService.get<AvailableRolesDto>(endpoints.availableRoles)
      return response.data
   }
}


export default new AuthService()
// login

//logout

