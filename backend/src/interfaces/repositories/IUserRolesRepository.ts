import { UserRolesEntity } from '../../entities/UserRolesEntity';
import { USER_ROLE } from '../../lib/types/common/enums';
import { IGenericRepository } from './IGenericRepository';


export interface IUserRolesRepository extends IGenericRepository<UserRolesEntity> {

    //
    GetUsers(role: USER_ROLE): Promise<UserRolesEntity>
}