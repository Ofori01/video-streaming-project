import { UserService } from "../../services/UserService";
import {
  response,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { createUserDto } from "./user-dtos";
import { UserEntity } from "../../entities/UserEntity";
import { UserRolesEntity } from "../../entities/UserRolesEntity";
import { AppDataSource } from "../../config/db.config";
import { USER_ROLE } from "../../lib/types/common/enums";
import { CategoryEntity } from "../../entities/CategoryEntity";

export class UserController {
  constructor(private _userService: UserService) {}

  //init db
  initDb = async (req: Request<{}, {}, {
    categories: [{
      name: string,
      description: string,
    }],
    userRoles: [{
      name: USER_ROLE,
      description: string 
    }]
  }>, res: Response) => {
    try {
      const categoriesRepo = AppDataSource.getRepository(CategoryEntity)
      const userRolesRepo = AppDataSource.getRepository(UserRolesEntity)

      //Todo: init categories
      for (const category of req.body.categories){
        const newCat = categoriesRepo.create()
        newCat.description = category.description
        newCat.name = category.name
        await categoriesRepo.save(newCat)
      }


      //TODO - init user roles
      for (const role of req.body.userRoles){
        const newRole = userRolesRepo.create()
        newRole.name = role.name
        newRole.description = role.description
        await userRolesRepo.save(newRole)

      }
      
      res.status(201).send({
        message: "db initialized successfully"
      })

      
    } catch (error) {
      console.error(error)
      res.status(500).send({
        message: "unsuccessful"
      })
    }
  }

  //create user
  createUser = async (
    req: Request<{}, {}, createUserDto>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      
      const roleRepository = AppDataSource.getRepository(UserRolesEntity)
      
      const role = await roleRepository.findOne({where: {name: req.body.role}})
      if (!role) {
        return res.status(400).send({ message: `Invalid role: ${req.body.role}` })
      }
      const user = new UserEntity();
      user.email = req.body.email
      user.password = req.body.password
      user.username = req.body.username
      user.role = role

      
      const newUser = await this._userService.Create(user);
      return res.status(201).send({
        message: "User created successfully",
        data: newUser,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "unsuccessful"
      })
    }
  };
}
