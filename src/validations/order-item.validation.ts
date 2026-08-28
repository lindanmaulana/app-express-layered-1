import z from "zod";
import { idSchema } from "./base.validation.js";

export const orderItemSchema = z.object({
    id: idSchema,
    order_id: z.number().int("Order ID harus berupa bilangan bulat").positive("Order ID harus berupa angka positif"),
    product_id: z.number().int("Produk ID harus berupa bilangan bulat").positive("Produk ID harus berupa angka positif"),
    quantity: z.number().int("Jumlah item harus berupa bilangan bulat").positive("Jumlah item harus berupa angka positif"),
    price_at_purchase: z.number().positive("Harga beli harus berupa angka positif"),
    created_at: z.date(),
    updated_at: z.date()
})

export const createOrderItemSchema = orderItemSchema.pick({
    order_id: true,
    product_id: true,
    quantity: true,
    price_at_purchase: true
})

export type OrderItemDTO = z.infer<typeof orderItemSchema>
export type CreateOrderItemDTO = z.infer<typeof createOrderItemSchema>