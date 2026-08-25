import z from "zod";
import { idSchema, paginationQuerySchema } from "./base.validation.js";
import { USER_ROLE, USER_ROLES } from "../constants/user-role.constant.js";

export const userSchema = z.object({
    id: idSchema,
    name: z.string("Nama tidak valid").trim().min(3, "Nama minimal 5 karakter").max(100, "Nama maksimal 100 karakter"),
    email: z.email("Email tidak valid").trim().toLowerCase(),
    password: z.string("Password tidak valid").min(8, "Password minimal 8 karakter").regex(/[A-Z]/, "Password harus mengandung minimal satu huruf kapital").regex(/[0-9]/, "Password minimal harus mengandung satu angka"),
    role: z.enum(USER_ROLES).default(USER_ROLE.USER),
    created_at: z.date().optional(),
    updated_at: z.date().optional()
})

export const getUsersQuerySchema = paginationQuerySchema.extend({
    search: z.string().trim().optional(),
    role: z.enum(USER_ROLES, "Role User tidak valid").optional()
})

export const updateProfileUserSchema = userSchema.pick({
    name: true,
    email: true
}).partial()

export type UserDTO = z.infer<typeof userSchema>

export type GetUsersQueryDTO = z.infer<typeof getUsersQuerySchema>

export type UpdateProfileUserDTO = z.infer<typeof updateProfileUserSchema>