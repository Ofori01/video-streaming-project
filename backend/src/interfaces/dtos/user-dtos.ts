import { USER_ROLE } from "../../lib/types/common/enums"


export interface createUserDto {

    username: string
    email: string
    password: string
    //would be removed
    role: USER_ROLE

}

export interface getUsersQueryDto{
    role?: USER_ROLE
}
