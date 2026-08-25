import type { Request, Response, NextFunction } from "express"
import { JWT_DEFAULT } from "../constants/jwt.constant.js"
import { UnauthorizedError } from "../errors/unauthorized.js"
import { verifyAccessToken, verifyRefreshToken } from "../utils/jwt.util.js"
import type { UserRole } from "../constants/user-role.constant.js"
import { getAuthUser } from "../utils/auth-user.util.js"
import type { JwtPayload } from "../types/jwt.type.js"
import { ForbiddenError } from "../errors/forbidden.js"

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


export const authenticateRefresh = (req: Request, res: Response, next: NextFunction) => {
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

export const authorizeRoles = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = getAuthUser(req) as JwtPayload

        if (!roles.includes(user.role)) throw new ForbiddenError("Akses ditolak: Anda tidak memiliki hak akses untuk halaman ini. ")

        next()
    }
}