import type { ApiSuccessResponse } from "./genericResponse";


interface loginResponseData {
    id: number
    email: string
}
interface VerifyOtpResponseData{
    token: string
    user: {
        id: number,
        email: string,
        username: string,
        role: string
    }
}

export interface LoginErrorResponse{
    
    success: boolean
    message: string

}

export type VerifyOtpDto = ApiSuccessResponse<VerifyOtpResponseData>
export type LoginDto=  ApiSuccessResponse<loginResponseData>