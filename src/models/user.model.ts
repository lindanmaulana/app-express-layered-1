import type { UserRole } from "../constants/user-role.constant.js";
import type { PaginationMeta } from "../types/pagination.type.js";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string
  role: UserRole
  created_at: Date;
  updated_at: Date
}

export type UserResponse = Omit<User, "password">;

export interface GetUsersQueryData {
  search?: string | undefined
  role?: UserRole | undefined

  page?: number | undefined
  limit?: number | undefined
}

export type UserFilterParams = Omit<GetUsersQueryData, "page"> & { offset?: number }

export type PaginatedUsersResult = {
  data: User[],
  meta: PaginationMeta
}

export interface GetByIdUserDTO {
  id: string;
}

export type CreateUserData = Omit<User, "id" | "created_at" | "updated_at">

export type UpdateProfileUserData = Partial<Pick<User, "name" | "email">>

type UpdateUser = Partial<Omit<User, "id" | "created_at" | "updated_at">>
export type UpdateUserData = {
  [K in keyof UpdateUser]?: UpdateUser[K] | undefined
}