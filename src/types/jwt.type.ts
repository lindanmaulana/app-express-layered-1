import type { UserRole } from "../constants/user-role.constant.js"

export interface JwtPayload {
    userId: number
    email: string
    role: UserRole
}