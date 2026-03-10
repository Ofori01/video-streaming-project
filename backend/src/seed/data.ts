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
  },
];

export const adminUserSeed = {
  email: "admin@gmail.com",
  username: "admin",
  password: bcrypt.hashSync("Admin@123"),
  firstName: "System",
  lastName: "Administrator",
  isEmailVerified: true,
};

export const videoCategoriesSeed = [
  {
    name: "Entertainment",
    description: "Movies, TV shows, and general entertainment content",
  },
  {
    name: "Education",
    description: "Educational and tutorial videos",
  },
  {
    name: "Gaming",
    description: "Gaming videos, walkthroughs, and esports",
  },
  {
    name: "Music",
    description: "Music videos, concerts, and performances",
  },
  {
    name: "Sports",
    description: "Sports highlights, matches, and athletic content",
  },
  {
    name: "News",
    description: "News and current events coverage",
  },
  {
    name: "Technology",
    description: "Tech reviews, tutorials, and innovations",
  },
  {
    name: "Lifestyle",
    description: "Vlogs, lifestyle, and daily life content",
  },
  {
    name: "Comedy",
    description: "Stand-up, sketches, and humorous content",
  },
  {
    name: "Documentary",
    description: "Documentary films and informational content",
  },
];
