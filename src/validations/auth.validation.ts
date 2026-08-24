import type z from "zod";
import { userSchema } from "./user.validation.js";

export const registerSchema = userSchema.pick({
    name: true,
    email: true,
    password: true,
    role: true
})

export type RegisterDTO = z.infer<typeof registerSchema>