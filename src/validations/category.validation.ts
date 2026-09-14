import z from "zod";
import { idSchema, paginationQuerySchema } from "./base.validation.js";
import { SORTABLE_COLUMNS, SORTABLE_COLUMNS_VALUE } from "../constants/category.constant.js";

export const categorySchema = z.object({
    id: idSchema,
    name: z.string().trim().min(1, "Nama kategori wajib diisi").max(100, "Nama kategori maksimal 100 karakter"),
    slug: z.string().trim().min(1, "Slug kategori wajib di isi").max(100, "Slug kategori maksimal 100 karakter").toLowerCase(),
    created_at: z.date().optional(),
    updated_at: z.date().optional()
})


export const getCategoriesQuerySchema = paginationQuerySchema.extend({
    search: z.string().trim().optional(),
    sortBy: z.enum(SORTABLE_COLUMNS_VALUE).default(SORTABLE_COLUMNS.createdAt)
})

export const getCategoriesCursorQuerySchema = paginationQuerySchema.pick({
    limit: true,
    sortOrder: true,
}).extend({
    search: z.string().trim().optional(),
    cursor: z.string().trim().optional(),
    sortBy: z.enum(SORTABLE_COLUMNS_VALUE).default(SORTABLE_COLUMNS.createdAt)
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
export type GetCategoriesCursorQueryDTO = z.infer<typeof getCategoriesCursorQuerySchema>

export type CreateCategoryDTO = z.infer<typeof createCategorySchema>
export type UpdateCategoryDTO = z.infer<typeof updateCategorySchema>