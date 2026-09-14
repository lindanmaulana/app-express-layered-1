import z from "zod"
import { SORTABLE_ORDER, SORTABLE_ORDER_VALUES } from "../constants/sort-order.constant.js"


export const idSchema = z.coerce.number().int().positive("ID harus berupa angka positif")
export const slugSchema = z.string().trim().min(1, "Slug tidak boleh kosong").max(100, "Slug maksimal 100 karakter")
export const positiveIntSchema = z.number().int("Jumlah harus berupa bilangan bulat").positive("Jumlah harus lebih dari 0")
export const positivePriceSchema = z.number().positive("Harga harus lebih dari 0")

export const paginationQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    sortOrder: z.string().toUpperCase().pipe(z.enum(SORTABLE_ORDER_VALUES)).default(SORTABLE_ORDER.ASC),
    cursor: z.coerce.number().int("Kursor harus bilangan bulat").min(1).default(10),
    
})