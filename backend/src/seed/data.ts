import { USER_ROLE } from "../lib/types/common/enums";
import * as bcrypt from "bcryptjs";

export const userRolesSeed = [
  {
    name: USER_ROLE.ADMIN,
    description: "Administrator with full system access",
  },
  {
    name: USER_ROLE.USER,
    description: "Regular user with standard access",
  }
];

export const adminUserSeed = {
  email: "admin@example.com",
  username: "admin",
  password: bcrypt.hashSync("Admin@123"),
  firstName: "System",
  lastName: "Administrator",
  isEmailVerified: true,
};