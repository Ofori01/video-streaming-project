import type { ApiSuccessResponse } from "./genericResponse";


interface loginResponseData {
    id: number
    email: string
}

export interface LoginErrorResponse{
    
    success: boolean
    message: string

}
export type LoginDto=  ApiSuccessResponse<loginResponseData>