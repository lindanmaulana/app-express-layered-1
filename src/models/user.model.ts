import type { UserRole } from "../constants/user-role.constant.js";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string
  role: UserRole
  created_at: Date;
}

export type UserResponse = Omit<User, "password">;

export interface GetByIdUserDTO {
  id: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string
  role: string
}

export interface UpdateUserDTO {
  name?: string
}