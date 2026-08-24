import type {Request, Response, NextFunction} from "express"
import type { RegisterDTO } from "../validations/auth.validation.js"
import { authService } from "../services/auth.service.js"
import { StatusCodes } from "http-status-codes"
import { sendResponse } from "../utils/response.util.js"
import { MS } from "../constants/time.const.js"


export const authController = {
    register: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payload: RegisterDTO = req.body

            const result = await authService.register(payload)
            res.cookie("access_token", result.tokens.accessToken, {
                httpOnly: true,
                maxAge: 1 * MS.HOUR
            })

            res.cookie("refresh_token", result.tokens.refreshToken, {
                httpOnly: true,
                maxAge: 7 * MS.DAY
            })

            sendResponse(res, StatusCodes.CREATED, "Registrasi akun berhasil", result.user)
        } catch (err) {
            next(err)
        }
    }
}