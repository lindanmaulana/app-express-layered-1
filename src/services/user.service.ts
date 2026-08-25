import type {
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
