import type { PoolClient } from "pg";
import pool from "../config/db.js";
import type { CreateOrderItemData, OrderItem } from "../models/order_item.model.js";

export const orderItemRepository = {
    findAllByOrderId: async (orderId: number): Promise<OrderItem[]> => {
        const query = "SELECT id, order_id, product_id, quantity, price_at_purchase, created_at, updated_at FROM order_items WHERE order_id = $1"
        const orders = await pool.query<OrderItem>(query, [orderId])

        return orders.rows
    },

    create: async (data: CreateOrderItemData): Promise<OrderItem> => {
        const query = "INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES ($1, $2, $3, $4) RETURNING id, order_id, product_id, quantity, price_at_purchase, created_at, updated_at"
        const result = await pool.query<OrderItem>(query, [data.order_id, data.product_id, data.quantity, data.price_at_purchase])

        const createdOrderItem = result.rows[0]
        if (!createdOrderItem) throw new Error("Gagal membuat order item baru")

        return createdOrderItem
    },

    createWithTrx: async (data: CreateOrderItemData, client: PoolClient): Promise<OrderItem> => {
        const query = "INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES ($1, $2, $3, $4) RETURNING id, order_id, product_id, quantity, price_at_purchase, created_at, updated_at"
        const result = await client.query<OrderItem>(query, [data.order_id, data.product_id, data.quantity, data.price_at_purchase])

        const createdOrderItem = result.rows[0]
        if (!createdOrderItem) throw new Error("Gagal membuat order item baru")

        return createdOrderItem
    }
}