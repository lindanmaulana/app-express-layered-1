import type z from "zod";
import { userSchema } from "./user.validation.js";

export const registerSchema = userSchema.pick({
    name: true,
    email: true,
    password: true,
    role: true
})

export const loginSchema = userSchema.pick({
    email: true,
    password: true
})

export type RegisterDTO = z.infer<typeof registerSchema>
export type LoginDTO = z.infer<typeof loginSchema>