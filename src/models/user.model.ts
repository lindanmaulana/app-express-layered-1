export interface User {
  id: number;
  name: string;
  email: string;
  created_at: Date;
}

export type UserResponse = User;

export interface GetByIdUserDTO {
  id: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
}

export interface UpdateUserDTO {
  name?: string
}