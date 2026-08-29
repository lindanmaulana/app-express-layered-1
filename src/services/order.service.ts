import type { PoolClient } from "pg";
import pool from "../config/db.js";
import { ORDER_STATUS, ORDER_STATUS_LABEL } from "../constants/order-status.constant.js";
import { BadRequestError, InternalServerError } from "../errors/index.js";
import { NotFoundError } from "../errors/not-found.js";
import type { GetUserOrdersWithOrderItemsResponse, OrderResponse, OrderWithOrderItems } from "../models/order.model.js";
import { orderItemRepository } from "../repositories/order-item.repository.js";
import { orderRepository } from "../repositories/order.repository.js";
import { productRepository } from "../repositories/product.repository.js";
import { userRepository } from "../repositories/user.repository.js";
import type { JwtPayload } from "../types/jwt.type.js";
import { parsePagination } from "../utils/pagination.util.js";
import type { CreateOrderDTO, GetOrdersQueryDTO } from "../validations/order.validation.js";

export const orderService = {
    getMyOrders: async (user: JwtPayload, query: GetOrdersQueryDTO): Promise<GetUserOrdersWithOrderItemsResponse> => {
        const {page, limit, skip} = parsePagination(query)

        const checkUser = await userRepository.findById(user.userId)

        const [orders, totalData] = await Promise.all([orderRepository.findAll({limit, offset: skip, status: query.status}, checkUser?.id), orderRepository.countAll({limit, offset: skip, status: query.status}, checkUser?.id)])
        const totalPages = Math.ceil(totalData / limit)

        const orderWithOrderItems: OrderWithOrderItems[] = await Promise.all(orders.map(async (order) => {
            const orderItems = await orderItemRepository.findAllByOrderId(order.id)

            return {
                order: {
                    ...order,
                    order_items: orderItems
                },
                
            }
        }))

        return {
            data: orderWithOrderItems,

            meta: {
                page: page,
                limit: limit,
                totalData: totalData,
                totalPages: totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        }
    },

    getById: async (id: number): Promise<OrderResponse> => {
        const order = await orderRepository.findById(id)
        if (!order) throw new NotFoundError("Pesanan tidak ditemukan")

        return order
    },

    create: async (user: JwtPayload, dto: CreateOrderDTO): Promise<OrderResponse> => {
        const checkUser = await userRepository.findById(user.userId)
        if (!checkUser) throw new NotFoundError("Pengguna tidak ditemukan")

        if (!dto.items || dto.items.length === 0) throw new BadRequestError("Pesanan tidak boleh kosong")

        let totalPrice: number = 0
        for(const item of dto.items) {
            const checkProduct = await productRepository.findById(item.product_id)
            if (!checkProduct) throw new NotFoundError(`Produk ${item.product_name} tidak ditemukan`)

            if (checkProduct.stock < item.quantity) throw new BadRequestError(`Stok produk ${checkProduct.name} tidak cukup, sisa ${checkProduct.stock} stok lagi`)

            totalPrice += checkProduct.price * item.quantity
        }

        const client: PoolClient = await pool.connect()
        try {
            await client.query("BEGIN")

            const result = await orderRepository.createWithTrx({user_id: user.userId, total_amount: totalPrice}, client)
            for (const item of dto.items) {
                await orderItemRepository.createWithTrx({order_id: result.id, product_id: item.product_id, quantity: item.quantity, price_at_purchase: item.product_price}, client)

                await productRepository.decrementStockWithTrx(item.product_id, {quantity: item.quantity}, client)
            }

            await client.query("COMMIT")

            return result
        } catch (err) {
            await client.query("ROLLBACK")

            throw err
        } finally {
            client.release()
        }
    },

    cancelOrder: async (user: JwtPayload, id: number): Promise<void> => {
        const checkUser = await userRepository.findById(user.userId)
        if (!checkUser) throw new NotFoundError("Pengguna tidak ditemukan")

        const checkOrder = await orderRepository.findById(id)
        if (!checkOrder || checkOrder.user_id !== user.userId) throw new NotFoundError("Pesanan tidak ditemukan")

        if (checkOrder.status === ORDER_STATUS.CANCELLED) throw new BadRequestError(`Status pesanan telah ${ORDER_STATUS_LABEL[checkOrder.status]}, tidak dapat dibatalkan`)
        if (checkOrder.status === ORDER_STATUS.PAID) throw new BadRequestError(`Status pesanan telah ${ORDER_STATUS_LABEL[checkOrder.status]}, tidak dapat dibatalkan`)

        const orderItems = await orderItemRepository.findAllByOrderId(checkOrder.id)
        const client = await pool.connect()
        try {
            await client.query("BEGIN")

            const result = await orderRepository.updateByIdWithTrx(checkOrder.id, {status: ORDER_STATUS.CANCELLED}, client)
            if (!result) throw new InternalServerError("Gagal membatalkan pesanan, silahkan coba lagi")

            for (const item of orderItems) {
                await productRepository.incrementStockWithTrx(item.product_id, {quantity: item.quantity}, client)
            }

            await client.query("COMMIT")
        } catch (err) {
            await client.query("ROLLBACK")

            throw err
        } finally {
            client.release()
        }
    },

    createWithLock: async (user: JwtPayload, dto: CreateOrderDTO): Promise<OrderResponse> => {
        const checkUser = await userRepository.findById(user.userId)
        if (!checkUser) throw new NotFoundError("Pengguna tidak ditemukan")

        if (!dto.items || dto.items.length === 0) throw new BadRequestError("Pesanan tidak boleh kosong")

        const client: PoolClient = await pool.connect()
        try {
            await client.query('BEGIN')

                let totalPrice: number = 0
                for (const item of dto.items) {
                    const checkProduct = await productRepository.findByIdWithLock(item.product_id, client)
                    if (!checkProduct) throw new NotFoundError(`Produk ${item.product_name} tidak ditemukan`)

                    if (checkProduct.stock < item.quantity) throw new BadRequestError(`Stok produk ${checkProduct.name} tidak cukup, sisa ${checkProduct.stock} stok lagi`)

                        totalPrice += checkProduct.price * item.quantity
                }

                const newOrder = await orderRepository.createWithTrx({user_id: user.userId, total_amount: totalPrice}, client)
                for (const item of dto.items) {
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

    cancelWithLock: async (user: JwtPayload, id: number): Promise<void> => {
        const checkUser = await userRepository.findById(user.userId)
        if (!checkUser) throw new NotFoundError("Pengguna tidak ditemukan")

        const client = await pool.connect()
        try {
            await client.query("BEGIN")
            
                const checkOrder = await orderRepository.findByIdWithLock(id, client)
                if (!checkOrder) throw new NotFoundError("Pesanan tidak ditemukan")
                if (checkOrder.status === ORDER_STATUS.CANCELLED || checkOrder.status === ORDER_STATUS.PAID) throw new BadRequestError(`Status pesanan telah ${ORDER_STATUS_LABEL[checkOrder.status]}, tidak dapat dibatalkan`)
                
                const orderItems = await orderItemRepository.findAllByOrderIdWithTrx(checkOrder.id, client)

                const result = await orderRepository.updateByIdWithTrx(checkOrder.id, {status: ORDER_STATUS.CANCELLED}, client)
                if (!result) throw new InternalServerError('Gagal membatalkan pesanan, silahkan coba lagi')

                for (const item of orderItems) {
                    await productRepository.decrementStockWithTrx(item.product_id, {quantity: item.quantity}, client )
                }

            await client.query("COMMIT")
        } catch (err) {
            await client.query("ROLLBACK")

            throw err
        } finally {
            client.release()
        }
    }
}