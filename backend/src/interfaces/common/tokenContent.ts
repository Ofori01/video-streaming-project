import { USER_ROLE } from "../../lib/types/common/enums";

export interface TokenContent {
  id: number;
  email: string;
  username: string;
  role: USER_ROLE;
}
