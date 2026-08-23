import z from "zod";
import { idSchema, paginationQuerySchema, positiveIntSchema, positivePriceSchema } from "./base.validation.js";


export const productSchema = z.object({
    id: idSchema,
    name: z.string().trim().min(3, "Nama produk minimal 3 karakter"),
    sku: z.string().trim().min(3, "SKU produk minimal 3 karakter").toUpperCase(),
    price: z.number().positive("Harga produk harus lebih dari 0"),
    stock: z.number().int("Stok harus berupa bilangan bulat").nonnegative("Stok tidak boleh bernilai negatif").default(0),
    created_at: z.date().optional()
})



export const getProductsQuerySchema = paginationQuerySchema.extend({
    search: z.string().trim().optional(),
    minPrice: z.coerce.number().positive("Harga minimal harus lebih dari 0").optional(),
    maxPrice: z.coerce.number().positive("Harga maksimal harus lebih dari 0").optional(),
})


export const createProductSchema = productSchema.pick({
    name: true,
    sku: true,
    price: true,
    stock: true
})

export const updateProductSchema = productSchema.pick({
    name: true,
    sku: true,
    price: true,
    stock: true
}).partial()

export const changePriceProductSchema = z.object({
    amount: positivePriceSchema
})

export const restockProductSchema = z.object({
    quantity: positiveIntSchema
})

export const reduceStockProductSchema = z.object({
    quantity: positiveIntSchema
})

export const restockItemSchema = productSchema.pick({
    id: true,
}).extend({
    quantity: positiveIntSchema
})

export const bulkRestockProductSchema = z.array(restockItemSchema).min(1, "Minimal harus menyertakan 1 produk untuk di-restock")
export const bulkDeleteProductsSchema = z.object({
    ids: z.array(idSchema)
})


export type GetProductsQueryDTO = z.infer<typeof getProductsQuerySchema>

export type CreateProductDTO = z.infer<typeof createProductSchema>
export type UpdateProductDTO = z.infer<typeof updateProductSchema>
export type ChangePriceProductDTO = z.infer<typeof changePriceProductSchema>
export type RestockProductDTO = z.infer<typeof restockProductSchema>
export type ReduceStockProductDTO = z.infer<typeof reduceStockProductSchema>
export type BulkRestockProductDTO = z.infer<typeof bulkRestockProductSchema>
export type BulkDeleteProductsDTO = z.infer<typeof bulkDeleteProductsSchema>