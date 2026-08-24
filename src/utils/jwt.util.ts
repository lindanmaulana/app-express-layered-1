import jwt from "jsonwebtoken";
import type { StringValue } from "ms";
import { env } from "../config/env.js";
import { NotFoundError } from "../errors/not-found.js";
import type { JwtPayload } from "../types/jwt.type.js";
import { UnauthorizedError } from "../errors/unauthorized.js";

export const generatedAccessToken = (payload: JwtPayload): string => {
    if (!env.JWT_ACCESS_TOKEN) throw new NotFoundError("Data token akses tidak ditemukan")

    const expiresIn = (env.JWT_ACCESS_EXPIRES_IN ?? "15m") as StringValue

    return jwt.sign(payload, env.JWT_ACCESS_TOKEN, {
        expiresIn: expiresIn
    })
}

export const generateRefreshToken = (payload: JwtPayload): string => {
    if (!env.JWT_REFRESH_TOKEN) throw new NotFoundError("Data refresh token tidak ditemukan")

    const expiresIn =(env.JWT_REFRESH_EXPIRES_IN ?? "7d") as StringValue

    return jwt.sign(payload, env.JWT_REFRESH_TOKEN, {
        expiresIn: expiresIn
    })
}

export const verifyAccessToken = (token: string): JwtPayload => {
    if (!env.JWT_ACCESS_TOKEN) throw new NotFoundError("Data token akses tidak ditemukan")

    try {
        return jwt.verify(token, env.JWT_ACCESS_TOKEN) as JwtPayload
    } catch (err) {
        throw new UnauthorizedError("Sesi akses tidak valid atau sudah kedaluarsa")
    }
}