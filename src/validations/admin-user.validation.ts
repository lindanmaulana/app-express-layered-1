import type z from "zod";
import { userSchema } from "./user.validation.js";

export const changeUserRoleSchema = userSchema.pick({
    role: true
})

export type ChangeUserRoleDTO = z.infer<typeof changeUserRoleSchema>