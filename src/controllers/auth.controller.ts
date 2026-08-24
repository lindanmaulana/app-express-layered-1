import type {Request, Response, NextFunction} from "express"
import type { RegisterDTO } from "../validations/auth.validation.js"
import { authService } from "../services/auth.service.js"
import { StatusCodes } from "http-status-codes"
import { sendResponse } from "../utils/response.util.js"
import { MS } from "../constants/time.const.js"
import { JWT_DEFAULT } from "../constants/jwt.constant.js"


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

            sendResponse(res, StatusCodes.CREATED, "Login akun berhasil", result.user)
        } catch (err) {
            next(err)
        }
    }
}