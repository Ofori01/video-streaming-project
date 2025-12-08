import { UserService } from "../../services/UserService";
import {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { createUserDto, getUsersQueryDto } from "./user-dtos";
import { UserEntity } from "../../entities/UserEntity";
import { UserRolesEntity } from "../../entities/UserRolesEntity";
import { AppDataSource } from "../../config/db.config";
import responseHandler from "../../middlewares/responseHandler/responseHandler";
import bcrypt from 'bcryptjs'

export class UserController {
  constructor(private _userService: UserService) {}

  //init db
  // initDb = async (
  //   req: Request<
  //     {},
  //     {},
  //     {
  //       categories: [
  //         {
  //           name: string;
  //           description: string;
  //         }
  //       ];
  //       userRoles: [
  //         {
  //           name: USER_ROLE;
  //           description: string;
  //         }
  //       ];
  //     }
  //   >,
  //   res: Response
  // ) => {
  //   try {
  //     const categoriesRepo = AppDataSource.getRepository(CategoryEntity);
  //     const userRolesRepo = AppDataSource.getRepository(UserRolesEntity);

  //     //Todo: init categories
  //     for (const category of req.body.categories) {
  //       const newCat = categoriesRepo.create();
  //       newCat.description = category.description;
  //       newCat.name = category.name;
  //       await categoriesRepo.save(newCat);
  //     }

  //     //TODO - init user roles
  //     for (const role of req.body.userRoles) {
  //       const newRole = userRolesRepo.create();
  //       newRole.name = role.name;
  //       newRole.description = role.description;
  //       await userRolesRepo.save(newRole);
  //     }

  //     res.status(201).send({
  //       message: "db initialized successfully",
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).send({
  //       message: "unsuccessful",
  //     });
  //   }
  // };

  //create user
  createUser = async (
    req: Request<{}, {}, createUserDto>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const roleRepository = AppDataSource.getRepository(UserRolesEntity);

      const role = await roleRepository.findOne({
        where: { name: req.body.role },
      });
      if (!role) {
        return res
          .status(400)
          .send({ message: `Invalid role: ${req.body.role}` });
      }
      const user = new UserEntity();
      user.email = req.body.email;
      user.password = bcrypt.hashSync(req.body.password);
      user.username = req.body.username;
      user.role = role;

      const newUser = await this._userService.Create(user);
      return res.status(201).send({
        message: "User created successfully",
        data: newUser,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "unsuccessful",
      });
    }
  };

  // findAllUsers = async (
  //   req: Request<
  //     {},
  //     {},
  //     {},
  //     {
  //       role?: USER_ROLE;
  //       fromRolesTable: boolean;
  //       custom: true;
  //     }
  //   >,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   try {
  //     const userRepo = AppDataSource.getRepository(UserEntity);
  //     const rolesRepo = AppDataSource.getRepository(UserRolesEntity);

  //     if (!req.query.role) {
  //       const users = await userRepo.find({
  //         relations: {
  //           role: true,
  //         },
  //       });
  //       return res.send({
  //         message: "successful",
  //         data: users,
  //       });
  //     }
  //     if (req.query.fromRolesTable) {
  //       //fetch role
  //       const role = await rolesRepo.findOne({
  //         where: {
  //           name: req.query.role,
  //         },
  //       });
  //       if (!role) {
  //         return res.status(400).send({
  //           message: "role does not exist",
  //         });
  //       }
  //       const users = await userRepo.find({
  //         relations: {
  //           role: true,
  //         },
  //         where: {
  //           role: {
  //             id: role?.id,
  //           },
  //         },
  //       });

  //       return res.send({
  //         message: "users load",
  //         data: users,
  //       });
  //     }

  //     //custom -> selecting custom fields from join
  //     if (req.query.custom) {
  //       const users = await userRepo
  //         .createQueryBuilder("user")
  //         .leftJoin("user.role", "role")
  //         .where("role.name = :name", { name: req.query.role || "user" }).select([
  //           'user.username',
  //           'user.email',
  //           'user.id',
  //           'role.id',
  //           'role.name'
  //         ]).getMany();

  //         return res.send({
  //           message: "Users from query builder",
  //           data: users
  //         })
  //     }
  //     // if (req.query.custom) {
  //     //   const users = await userRepo
  //     //     .createQueryBuilder("user")
  //     //     .leftJoin("user.role", "role")
  //     //     .select([
  //     //       "user.id",
  //     //       "user.username",
  //     //       "user.email",
  //     //       "role.id",
  //     //       "role.name",
  //     //     ]).getMany();

  //     //     return res.send({
  //     //       message: "users using query builder",
  //     //       data: users
  //     //     })
  //     // }

  //     //using roles table
  //     const roles = await rolesRepo.findOne({
  //       where: { name: req.query.role },
  //       relations: {
  //         users: true,
  //       },
  //     });
  //     console.log("using roles table");
  //     return res.send({
  //       message: "loaded users",
  //       data: roles?.users,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).send({
  //       message: "Unsuccessful ",
  //     });
  //   }
  // };

  GetUsers = async (
    req: Request<{}, {}, {}, getUsersQueryDto>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (req.query.role) {
        const users = await this._userService.GetRoleUsers(req.query.role);
        return responseHandler.success(
          res,
          users,
          "Users retrieved successfully"
        );
      }
      const users = await this._userService.GetAll({
        relations: {
          role: true,
        },
      });
      return responseHandler.success(
        res,
        users,
        "Users retrieved successfully"
      );
    } catch (error) {
      console.error(error);
      return next(error);
    }
  };
}
