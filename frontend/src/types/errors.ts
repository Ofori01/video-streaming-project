
 interface ErrorItem {
    message: string
    field: string
 }

 export interface ApiErrorResponse {
    success: boolean //will remove later
    message: string
    errors?: ErrorItem[]
 }