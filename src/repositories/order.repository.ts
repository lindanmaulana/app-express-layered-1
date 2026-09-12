import type { PoolClient } from "pg"
import pool from "../config/db.js"
import type { CreateOrderData, Order, OrderFilterParams, UpdateOrderData } from "../models/order.model.js"

export const orderRepository = {

    buildWhereClause: (filters: OrderFilterParams, userID?: number) => {
        const conditions: string[] = []
        const values: (string | number | boolean)[] = []

        if (userID) {
            values.push(userID)
            conditions.push(` user_id = $${values.length} `)
        }

        if (filters.status) {
            values.push(filters.status)
            conditions.push(` status = $${values.length} `)
        }

        const whereSQL = conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : ""

        return { whereSQL, values }
    },

    findAll: async (filters: OrderFilterParams, userID?: number): Promise<Order[]> => {
        const { whereSQL, values } = orderRepository.buildWhereClause(filters, userID)
        const queryValues = [...values]

        let paginationClause = ""

        if (filters.limit) {
            queryValues.push(filters.limit)
            paginationClause += ` LIMIT $${queryValues.length}`
        }

        if (filters.offset) {
            queryValues.push(filters.offset)
            paginationClause += ` OFFSET $${queryValues.length}`
        }

        const query = `SELECT id, user_id, total_amount, status, created_at, updated_at FROM orders ${whereSQL} ORDER BY created_at DESC ${paginationClause}`
        const orders = await pool.query<Order>(query, queryValues)

        return orders.rows
    },

    countAll: async ( filters: OrderFilterParams, userID?: number): Promise<number> => {
        const {whereSQL, values} = orderRepository.buildWhereClause(filters, userID)
        const query = `SELECT COUNT(id) AS total FROM orders ${whereSQL}`

        const result = await pool.query(query, values)

        return parseInt(result.rows[0].total ?? "0", 0)
    },

    findById: async (id: number): Promise<Order | null> => {
        const query = "SELECT id, user_id, total_amount, status, created_at, updated_at FROM orders WHERE id = $1"

        const order = await pool.query<Order>(query, [id])

        return order.rows[0] ?? null
    },

    create: async (data: CreateOrderData): Promise<Order> => {
        const query = "INSERT INTO orders (user_id, total_amount) VALUES ($1, $2) RETURNING id, user_id, total_amount, status, created_at, updated_at"
        const result = await pool.query<Order>(query, [data.user_id, data.total_amount])

        const createdOrder = result.rows[0]
        if (!createdOrder) throw new Error("Gagal membuat order baru")

        return createdOrder
    },

    updateById: async (id: number, data: UpdateOrderData): Promise<boolean> => {
        const query = "UPDATE orders SET total_amount = COALESCE($1, total_amount), status = COALESCE($2, status), updated_at = NOW() WHERE id = $3"
        const result = await pool.query<Order>(query, [data.total_amount ?? null, data.status ?? null, id])

        return (result.rowCount ?? 0) > 0
    },

    findByIdWithLock: async (id: number, client: PoolClient): Promise<Order | null> => {
        const query = "SELECT id, user_id, total_amount, status, created_at, updated_at FROM orders WHERE id = $1 FROM UPDATE"
        const order = await client.query<Order>(query, [id])

        return order.rows[0] ?? null
    },

    createWithTrx: async (data: CreateOrderData, client: PoolClient): Promise<Order> => {
        const query = "INSERT INTO orders (user_id, total_amount, idempotency_key) VALUES ($1, $2, $3) RETURNING id, user_id, total_amount, status, idempotency_key, created_at, updated_at"
        const result = await client.query<Order>(query, [data.user_id, data.total_amount, data.idempotency_key])

        const createdOrder = result.rows[0]
        if (!createdOrder) throw new Error("Gagal membuat order baru")

        return createdOrder
    },

    updateByIdWithTrx: async (id: number, data: UpdateOrderData, client: PoolClient): Promise<boolean> => {
        const query = "UPDATE orders SET total_amount = COALESCE($1, total_amount), status = COALESCE($2, status), updated_at = NOW() WHERE id = $3"
        const result = await client.query<Order>(query, [data.total_amount ?? null, data.status ?? null, id])

        return (result.rowCount ?? 0) > 0
    },
}