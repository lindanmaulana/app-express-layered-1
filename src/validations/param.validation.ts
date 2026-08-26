import z from "zod";
import { idSchema, slugSchema } from "./base.validation.js";

export const idParamSchema = z.object({
    id: idSchema
})

export const slugParamSchema = z.object({
    slug: slugSchema
})