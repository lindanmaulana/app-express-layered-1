import z from "zod"


export const idSchema = z.coerce.number().int().positive("ID harus berupa angka positif")
export const slugSchema = z.string().trim().min(1, "Slug tidak boleh kosong").max(100, "Slug maksimal 100 karakter")
export const positiveIntSchema = z.number().int("Jumlah harus berupa bilangan bulat").positive("Jumlah harus lebih dari 0")
export const positivePriceSchema = z.number().positive("Harga harus lebih dari 0")

export const paginationQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10)
})