import type { LoginDto } from "@/types/dtos/auth"
import backendService from "./api.service"
import { endpoints } from "./constants"



class AuthService {

   async login(email: string, password: string){
    const response = await backendService.post<LoginDto>(endpoints.login,{email, password})
    return response.data
   } 
}


export default new AuthService()
// login

//logout

