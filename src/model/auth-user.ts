import { Token } from "./token";
import { User } from "./user";

export type AuthUser = Omit<User, 'password'> & Token;
