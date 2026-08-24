import { ConflictError } from "../errors/conflict.js";
import { userRepository } from "../repositories/user.repository.js";
import type { AuthResponse } from "../types/auth.type.js";
import { generatedAccessToken, generateRefreshToken } from "../utils/jwt.util.js";
import { hashPassword } from "../utils/password.util.js";
import type { RegisterDTO } from "../validations/auth.validation.js";

export const authService = {
    register: async (dto: RegisterDTO): Promise<AuthResponse> => {
        const user = await userRepository.existsByEmail(dto.email)
        if (user) throw new ConflictError("Email telah digunakan")

        const hashedPassword = await hashPassword(dto.password)
        const result = await userRepository.create({name: dto.name, email: dto.email, password: hashedPassword, role: dto.role})

        const accessToken = generatedAccessToken({userId: result.id, email: result.email, role: result.role})
        const refreshToken = generateRefreshToken({userId: result.id, email: result.email, role: result.role})

        console.log({accessToken, refreshToken})

        return {
            user: result,
            tokens: {
                accessToken,
                refreshToken
            }
        }
    },

    login: async () => {}
}