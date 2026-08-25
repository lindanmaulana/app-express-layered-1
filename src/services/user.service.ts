import { ConflictError } from "../errors/conflict.js";
import { InternalServerError } from "../errors/internal-server.js";
import { NotFoundError } from "../errors/not-found.js";
import type {
  User
} from "../models/user.model.js";
import { userRepository } from "../repositories/user.repository.js";
import type { UpdateProfileUserDTO } from "../validations/user.validation.js";

export const userService = {
  getById: async (id: number): Promise<User> => {
    const result = await userRepository.findById(id);

    if (!result) throw new Error("User not found");

    return result;
  },

  getProfile: async (userId: number): Promise<User> => {
    const user = await userRepository.findById(userId)
    if (!user) throw new NotFoundError("User tidak ditemukan")

    return user
  },

  updateProfile: async (userId: number, dto: UpdateProfileUserDTO): Promise<User> => {
    const user = await userRepository.findById(userId)
    if (!user) throw new NotFoundError("User tidak ditemukan")

    if (dto.email) {
      const isEmailExists = await userRepository.existsByEmail(dto.email)
      if (isEmailExists) throw new ConflictError("Email sudah terdaftar, silahkan gunakan email lain")
    }

    const result = await userRepository.updateById(userId, dto)
    if (!result) throw new InternalServerError("Gagal memperbarui profil. Silahkan coba lagi")

    return result
  },
};