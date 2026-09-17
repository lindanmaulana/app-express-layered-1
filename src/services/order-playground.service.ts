import { v4 as uuidv4 } from "uuid";
import pool from "../config/db.js";
import { BadRequestError } from "../errors/index.js";
import { NotFoundError } from "../errors/not-found.js";
import type { OrderResponse, ValidOrderItem } from "../models/order.model.js";
import { orderItemRepository } from "../repositories/order-item.repository.js";
import { orderRepository } from "../repositories/order.repository.js";
import { productRepository } from "../repositories/product.repository.js";
import { userRepository } from "../repositories/user.repository.js";
import type { JwtPayload } from "../types/jwt.type.js";
import type { CreateOrderDTO } from "../validations/order.validation.js";


export const orderPlaygroundService = {
    createWithCommitedRead: async (user: JwtPayload, dto: CreateOrderDTO): Promise<OrderResponse> => {
        const checkUser = await userRepository.findById(user.userId)
        if (!checkUser) throw new NotFoundError('Pengguna tidak ditemukan')
        
        if (!dto.items || dto.items.length === 0) throw new BadRequestError('Pesanan anda tidak valid')

        
        
        const idempotencyKey = uuidv4()
        const client = await pool.connect()
        try {
            await client.query('BEGIN TRANSACTION ISOLATION LEVEL READ COMMITTED')

            let totalPrice: number = 0
            let orderItems: ValidOrderItem[] = []
            for (const item of dto.items) {
                const checkProduct = await productRepository.findById(item.product_id)
                if (!checkProduct) throw new NotFoundError(`Produk dengan ID ${item.product_id} tidak ditemukan`)

                if (checkProduct.stock < item.quantity) throw new BadRequestError(`Stok produk ${checkProduct.name} tidak cukup, sisa ${checkProduct.stock} stok lagi.`)

                totalPrice += checkProduct.price * item.quantity
                orderItems.push({product_id: checkProduct.id, quantity: item.quantity, product_price: checkProduct.price})
            }

            const order = await orderRepository.createWithTrx({user_id: user.userId, total_amount: totalPrice, idempotency_key: idempotencyKey}, client)

            for (const item of orderItems) {
                await orderItemRepository.createWithTrx({order_id: order.id, product_id: item.product_id, quantity: item.quantity, price_at_purchase: item.product_price}, client)

                await productRepository.decrementStockWithTrx(item.product_id, { quantity: item.quantity }, client)
            }

            await client.query("COMMIT")
            return order
        } catch (err) {
            await client.query("ROLLBACK")

            throw err
        } finally {
            client.release()
        }
    },

    createWithRepeatableRead: async (user:JwtPayload, dto: CreateOrderDTO): Promise<OrderResponse> => {
        const checkUser = await userRepository.findById(user.userId)
        if (!checkUser) throw new NotFoundError("Pengguna tidak ditemukan")

        if (!dto.items || dto.items.length === 0) throw new BadRequestError('Pesanan anda tidak valid / kosong')

        const idempotencyKey = uuidv4()
        const client = await pool.connect()
        try {
            await client.query('BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ')

            let totalPrice: number = 0
            let orderItems: ValidOrderItem[] = []

            for (const item of dto.items) {
                const checkProduct = await productRepository.findById(item.product_id)
                if (!checkProduct) throw new NotFoundError(`Produk dengan ID ${item.product_id} tidak ditemukan`)

                if (checkProduct.stock < item.quantity) throw new BadRequestError(`Stok produk ${checkProduct.name} tidak cukup, sisa ${checkProduct.stock} stok lagi.`)

                totalPrice += checkProduct.price * item.quantity
                orderItems.push({product_id: checkProduct.id, quantity: item.quantity, product_price: checkProduct.price})
            }

            const newOrder = await orderRepository.createWithTrx({user_id: checkUser.id, total_amount: totalPrice, idempotency_key: idempotencyKey}, client)
            for (const item of orderItems) {
                await orderItemRepository.createWithTrx({order_id: newOrder.id, product_id: item.product_id, quantity: item.quantity, price_at_purchase: item.product_price}, client)

                await productRepository.decrementStockWithTrx(item.product_id, { quantity: item.quantity }, client)
            }

            await client.query("COMMIT")

            return newOrder
        } catch (err) {
            await client.query("ROLLBACK")

            throw err
        } finally {
            client.release()
        }
    },

    createWithSerializable: async (user: JwtPayload, dto: CreateOrderDTO): Promise<OrderResponse> => {
        const checkUser = await userRepository.findById(user.userId)
        if (!checkUser) throw new NotFoundError("Pengguna tidak ditemukan")

        if (!dto.items || dto.items.length === 0) throw new BadRequestError('Pesanan anda tidak valid / kosong')

        const idempotencyKey = uuidv4()
        const client = await pool.connect()
        try {
            await client.query('BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE')

            let totalPrice: number = 0
            let orderItems: ValidOrderItem[] = []

            for (const item of dto.items) {
                const checkProduct = await productRepository.findById(item.product_id)
                if (!checkProduct) throw new NotFoundError(`Produk dengan ID ${item.product_id} tidak ditemukan`)
                
                if (checkProduct.stock < item.quantity) throw new BadRequestError(`Stok produk ${checkProduct.name} tidak cukup, sisa ${checkProduct.stock} stok lagi.`)
                
                totalPrice += checkProduct.price * item.quantity
                orderItems.push({ product_id: checkProduct.id, quantity: item.quantity, product_price: checkProduct.price })
            }

            const newOrder = await orderRepository.createWithTrx({user_id: checkUser.id, total_amount: totalPrice, idempotency_key: idempotencyKey}, client)
            for (const item of orderItems) {
                await orderItemRepository.createWithTrx({order_id: newOrder.id, product_id: item.product_id, quantity: item.quantity, price_at_purchase: item.product_price}, client)
                await productRepository.decrementStockWithTrx(item.product_id, { quantity: item.quantity }, client)
            }

            await client.query('COMMIT')

            return newOrder
        } catch (err) {
            await client.query("ROLLBACK")

            throw err
        } finally {
            client.release()
        }
    },

    createWithRepeatableReadAndLock: async (user: JwtPayload, dto: CreateOrderDTO): Promise<OrderResponse> => {
        const checkUser = await userRepository.findById(user.userId)
        if (!checkUser) throw new NotFoundError("Pengguna tidak ditemukan")

        if (!dto.items || dto.items.length === 0) throw new BadRequestError("Pesanan anda tidak valid")

        const idempotencyKey = uuidv4()
        const client = await pool.connect()

        try {
            await client.query("BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ") 

                let totalPrice: number = 0
                let orderItems: ValidOrderItem[] = []

                for (const order of dto.items) {
                    const checkProduct = await productRepository.findByIdWithLock(order.product_id, client)
                    if (!checkProduct) throw new NotFoundError(`Produk dengan ID ${order.product_id} tidak ditemukan`)

                    if (checkProduct.stock < order.quantity) throw new BadRequestError(`Stok produk ${checkProduct.name} tidak cukup, sisa ${checkProduct.stock} stok lagi.`)

                    totalPrice += checkProduct.price * order.quantity
                    orderItems.push({product_id: checkProduct.id, product_price: checkProduct.price, quantity: order.quantity})
                }

                const newOrder = await orderRepository.createWithTrx({user_id: checkUser.id, total_amount: totalPrice, idempotency_key: idempotencyKey}, client)
                
                for (const item of orderItems) {
                    await orderItemRepository.createWithTrx({ order_id: newOrder.id, product_id: item.product_id, quantity: item.quantity, price_at_purchase: item.product_price }, client)

                    await productRepository.decrementStockWithTrx(item.product_id, { quantity: item.quantity }, client)
                }

            await client.query('COMMIT')

            return newOrder
        } catch (err) {
            await client.query("ROLLBACK")

            throw err
        } finally {
            client.release()
        }
    },

    // createWithIdempotencyAndLock: async (user: JwtPayload, idempotencyKey: string, dto: CreateOrderDTO): Promise<OrderResponse> => {
    //     const checkUser = await userRepository.findById(user.userId)
    //     if (!checkUser) throw new NotFoundError("Pengguna tidak ditemukan")

    //     // COMING SOON IMPLEMENT IDEMPOTENCY KEY & ROW LEVEL LOCKING
        
    //     const client = await pool.connect()
    //     try {
    //         await client.query('BEGIN')

    //         await client.query("COMMIT")
    //     } catch (err) {
    //         await client.query("ROLLBACK")
    //     } finally {
    //         client.release()
    //     }
    // },
}