import { InternalServerError } from "../errors/internal-server.js";
import { NotFoundError } from "../errors/not-found.js";
import type { PaginatedUsersResult, User } from "../models/user.model.js";
import { userRepository } from "../repositories/user.repository.js";
import type { ChangeUserRoleDTO } from "../validations/admin-user.validation.js";
import type { GetUsersQueryDTO } from "../validations/user.validation.js";

export const adminUserService = {
    getAll: async (dto: GetUsersQueryDTO): Promise<PaginatedUsersResult> => {
        const page = Math.max(1, Number(dto.page) || 1)
        const limit = Math.min(100, Math.max(1, Number(dto.limit) || 10))
        const search = dto.search?.trim() || ""
        const offset = (page - 1) * limit

        const [users, totalData] = await Promise.all([userRepository.findAll({...dto, search, limit, offset}), userRepository.countAll({...dto, search, limit, offset})])

        const totalPages = Math.ceil(totalData / limit)

        return {
            data: users,
            meta: {
                page: page,
                limit: limit,
                totalData: totalData,
                totalPages: totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        }
    },

    changeRole: async (userID: number, dto: ChangeUserRoleDTO): Promise<User> => {
        const user = await userRepository.findById(userID)
        if (!user) throw new NotFoundError("User tidak ditemukan")

        const result = await userRepository.updateById(userID, dto)
        if (!result) throw new InternalServerError("Gagal memperbarui role user, silahkan coba lagi")

        return result
    },
    
    deleteById: async (userID: number): Promise<void> => {
        const user = await userRepository.findById(userID)
        if (!user) throw new NotFoundError("User tidak ditemukan")

        const result = await userRepository.deleteById(user.id)
        if (!result) throw new InternalServerError("Gagal menghapus user, silahkan coba lagi")
    } 
}