import type {
  CreateUserDTO,
  UpdateUserDTO,
  User,
} from "../models/user.model.js";
import { userRepository } from "../repositories/user.repository.js";

export const userService = {
  getAll: async (): Promise<User[]> => {
    const result = await userRepository.findAll();

    return result;
  },

  getById: async (id: number): Promise<User> => {
    const result = await userRepository.findById(id);

    if (!result) throw new Error("User not found");

    return result;
  },

  create: async (dto: CreateUserDTO): Promise<User> => {
    const isEmailExists = await userRepository.existsByEmail(dto.email);
    if (isEmailExists) throw new Error("Email is taken.");

    const result = await userRepository.create(dto);

    return result;
  },

  update: async (id: number, dto: UpdateUserDTO): Promise<User> => {
    const user = await userRepository.findById(id);
    if (!user) throw new Error("User not found");

    const result = await userRepository.updateById(id, dto);
    if (!result)
      throw new Error("Gagal memperbarui data user, silahkan coba lagi");

    return result;
  },

  delete: async (id: number) => {
    const user = await userRepository.findById(id);
    if (!user) throw new Error("User not found");

    const result = await userRepository.deleteById(user.id);

    return result;
  },
};
