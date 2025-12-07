import { UserEntity } from "../../entities/UserEntity";
import { UserRolesEntity } from "../../entities/UserRolesEntity";
import { USER_ROLE } from "../../lib/types/common/enums";
import { IGenericService } from "./IGenericService";



export interface IUserService extends IGenericService<UserEntity> {
    
    //! define custom user service methods
    GetRoleUsers(role: USER_ROLE ): Promise<UserEntity[]>
}