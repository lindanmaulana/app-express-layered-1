import type { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { JWT_DEFAULT } from "../constants/jwt.constant.js"
import { MS } from "../constants/time.const.js"
import { authService } from "../services/auth.service.js"
import type { JwtPayload } from "../types/jwt.type.js"
import { getAuthUser } from "../utils/auth-user.util.js"
import { sendResponse } from "../utils/response.util.js"
import type { RegisterDTO } from "../validations/auth.validation.js"


export const authController = {
    register: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payload: RegisterDTO = req.body

            const result = await authService.register(payload)
            res.cookie(JWT_DEFAULT.ACCESS_TOKEN, result.tokens.accessToken, {
                httpOnly: true,
                maxAge: 1 * MS.HOUR
            })

            res.cookie(JWT_DEFAULT.REFRESH_TOKEN, result.tokens.refreshToken, {
                httpOnly: true,
                maxAge: 7 * MS.DAY
            })

            sendResponse(res, StatusCodes.CREATED, "Registrasi akun berhasil", result.user)
        } catch (err) {
            next(err)
        }
    },

    login: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payload: RegisterDTO = req.body

            const result = await authService.login(payload)
            res.cookie(JWT_DEFAULT.ACCESS_TOKEN, result.tokens.accessToken, {
                httpOnly: true,
                maxAge: 1 * MS.HOUR
            })

            res.cookie(JWT_DEFAULT.REFRESH_TOKEN, result.tokens.refreshToken, {
                httpOnly: true,
                maxAge: 7 * MS.DAY
            })

            sendResponse(res, StatusCodes.CREATED, "Login akun berhasil")
        } catch (err) {
            next(err)
        }
    },

    logout: async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.clearCookie(JWT_DEFAULT.ACCESS_TOKEN)
            res.clearCookie(JWT_DEFAULT.REFRESH_TOKEN)

            sendResponse(res, StatusCodes.OK, "Logout berhasil. Anda telah keluar dari sesi")
        } catch (err) {
            next(err)
        }
    },

    refreshAccessToken: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = getAuthUser(req) as JwtPayload
            const newAccessToken = await authService.refreshAccessToken(user.userId)

            res.cookie(JWT_DEFAULT.ACCESS_TOKEN, newAccessToken, {
                httpOnly: true,
                maxAge: 1 * MS.HOUR
            })

            sendResponse(res, StatusCodes.OK, "Sesi berhasil diperbarui")
        } catch (err) {
            next(err)
        }
    },
}