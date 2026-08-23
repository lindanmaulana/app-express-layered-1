import z from "zod";
import { idSchema } from "./base.validation.js";

export const idParamSchema = z.object({
    id: idSchema
})