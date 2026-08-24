import bcrypt from "bcrypt"
import { env } from "../config/env.js"

export const hashPassword = async (plainPassword: string): Promise<string> => {
    return await bcrypt.hash(plainPassword, env.PASSWORD_SALT_ROUNDS)
}

export const comparePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(plainPassword, hashedPassword)
}