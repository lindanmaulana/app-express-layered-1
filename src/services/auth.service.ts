import { BadRequestError } from "../errors/bad-request.js";
import { ConflictError } from "../errors/conflict.js";
import { userRepository } from "../repositories/user.repository.js";
import type { AuthResponse } from "../types/auth.type.js";
import { generatedAccessToken, generatedTokens, generateRefreshToken } from "../utils/jwt.util.js";
import { comparePassword, hashPassword } from "../utils/password.util.js";
import type { LoginDTO, RegisterDTO } from "../validations/auth.validation.js";

export const authService = {
    register: async (dto: RegisterDTO): Promise<AuthResponse> => {
        const user = await userRepository.existsByEmail(dto.email)
        if (user) throw new ConflictError("Email telah digunakan")

        const hashedPassword = await hashPassword(dto.password)
        const result = await userRepository.create({name: dto.name, email: dto.email, password: hashedPassword, role: dto.role})

        const accessToken = generatedAccessToken({userId: result.id, email: result.email, role: result.role})
        const refreshToken = generateRefreshToken({userId: result.id, email: result.email, role: result.role})

        return {
            user: result,
            tokens: {
                accessToken,
                refreshToken
            }
        }
    },

    login: async (dto: LoginDTO): Promise<AuthResponse> => {
        const user = await userRepository.findByEmail(dto.email)
        if (!user) throw new BadRequestError("Email atau password salah.")

        const isComparePassword = await comparePassword(dto.password, user.password)
        if (!isComparePassword) throw new BadRequestError("Email atau password salah")

        const {accessToken, refreshToken} = generatedTokens({userId: user.id, email: user.email, role: user.role})
        const { password, ...safeUser } = user
        
        return {
            user: safeUser,
            tokens: {
                accessToken,
                refreshToken
            }
        }
    }
}