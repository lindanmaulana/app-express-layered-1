import z from "zod";
import { idSchema, paginationQuerySchema } from "./base.validation.js";

export const categorySchema = z.object({
    id: idSchema,
    name: z.string().trim().min(1, "Nama kategori wajib diisi").max(100, "Nama kategori maksimal 100 karakter"),
    slug: z.string().trim().min(1, "Slug kategori wajib di isi").max(100, "Slug kategori maksimal 100 karakter").toLowerCase(),
    created_at: z.date().optional(),
    updated_at: z.date().optional()
})


export const getCategoriesQuerySchema = paginationQuerySchema.extend({
    search: z.string().trim().optional(),
})

export const createCategorySchema = categorySchema.pick({
    name: true,
    slug: true
})

export const updateCategorySchema = categorySchema.pick({
    name: true,
    slug: true
}).partial()


export type CategoryDTO = z.infer<typeof categorySchema>
export type GetCategoriesQueryDTO = z.infer<typeof getCategoriesQuerySchema>

export type CreateCategoryDTO = z.infer<typeof createCategorySchema>
export type UpdateCategoryDTO = z.infer<typeof updateCategorySchema>