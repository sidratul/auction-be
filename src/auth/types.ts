import { User } from "../user/user.entity";

export interface LoginResponse {
  user: User;
  access_token: string;
}

export interface TokenPayload {
  id: string;
  email: string;
}
