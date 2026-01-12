import type { ApiSuccessResponse } from "./genericResponse";


interface loginResponseData {
    id: number
    email: string
}
interface signUpResponseData {
    user: {
        id: number
        email: string
        username: string
        role: string
    }
    token : string
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



export type SignUpDto = ApiSuccessResponse<signUpResponseData>
export type VerifyOtpDto = ApiSuccessResponse<VerifyOtpResponseData>
export type LoginDto=  ApiSuccessResponse<loginResponseData>