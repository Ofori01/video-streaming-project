import authService from "@/backend/auth.Service"
import type { AvailableRolesDto } from "@/types/dtos/auth"
import type { ApiErrorResponse } from "@/types/errors"
import { useQuery } from "@tanstack/react-query"


export const useGetAvailableRoles = ()=>{
    return useQuery<AvailableRolesDto, ApiErrorResponse>({
        queryKey: ["auth","roles"],
        queryFn: ()=> authService.getAvailableRoles()
    })
}
