import type { Request } from "express"
import type { JwtPayload } from "jsonwebtoken"
import { UnauthorizedError } from "../errors/unauthorized.js"

export const getAuthUser = (req: Request): JwtPayload => {
    if (!req.user) throw new UnauthorizedError("Sesi otentikasi tidak valid atau telah berakhir")

    return req.user
}