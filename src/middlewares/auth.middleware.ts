import type { Request, Response, NextFunction } from "express"
import { JWT_DEFAULT } from "../constants/jwt.constant.js"
import { UnauthorizedError } from "../errors/unauthorized.js"
import { verifyAccessToken, verifyRefreshToken } from "../utils/jwt.util.js"

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.[JWT_DEFAULT.ACCESS_TOKEN]
        if (!token) throw new UnauthorizedError("Akses ditolak: Sesi telah berakhir. Silahkan login kembali")

        req.user = verifyAccessToken(token)

        next()
    } catch (err) {
        next(err)
    }
}


export const authorize = (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.cookies?.[JWT_DEFAULT.REFRESH_TOKEN]
        console.log({refreshToken})
        if (!refreshToken) throw new UnauthorizedError("Akses ditolak: Sesi telah berakhir. Silahkan login kembali")


        req.user = verifyRefreshToken(refreshToken)

        next()
    } catch (err) {
        next(err)
    }
}