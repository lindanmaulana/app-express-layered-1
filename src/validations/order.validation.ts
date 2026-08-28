import z from "zod";
import { idSchema, paginationQuerySchema } from "./base.validation.js";
import { ORDER_STATUS, ORDER_STATUS_VALUES } from "../constants/order-status.constant.js";

export const orderSchema = z.object({
    id: idSchema,
    user_id: z.coerce.number().int("User ID harus bilangan bulat").positive("User ID harus berupa angka positif"),
    total_amount: z.number().positive("Jumlah total harus lebih dari 0"),
    status: z.enum(ORDER_STATUS_VALUES).default(ORDER_STATUS.PENDING),
    created_at: z.date(),
    updated_at: z.date()
})


export const getOrdersQuerySchema = paginationQuerySchema.extend({
    status: z.enum(ORDER_STATUS_VALUES).optional()
})

const orderItem = z.object({
    product_id: z.number().int("Produk ID harus berupa bilaangan bulat").positive("Produk ID harus berupa angka positif"),
    product_name: z.string().trim().min(1, "Nama produk tidak boleh kosong"),
    product_price: z.number().positive("Harga produk harus berupa angka positif"),
    quantity: z.number().int("Jumlah item harus berupa bilangan bulat").positive("Jumlah item haru berupa angka positif")
})

export const createOrderSchema = z.object({
    items: z.array(orderItem)
})

export const updateOrderSchema = orderSchema.pick({
    total_amount: true,
    status: true,
}).partial()

export const updateStatusOrderSchema = orderSchema.pick({
    status: true
})

export type OrderDTO = z.infer<typeof orderSchema>
export type GetOrdersQueryDTO = z.infer<typeof getOrdersQuerySchema>
export type CreateOrderDTO = z.infer<typeof createOrderSchema>
export type UpdateOrderDTO = z.infer<typeof updateOrderSchema>
export type UpdateStatusOrderDTO = z.infer<typeof updateStatusOrderSchema>