import { ORDER_STATUS, ORDER_STATUS_LABEL } from "../constants/order-status.constant.js";
import { BadRequestError, InternalServerError } from "../errors/index.js";
import { NotFoundError } from "../errors/not-found.js";
import type { GetUserOrdersWithOrderItemsResponse, OrderWithOrderItems } from "../models/order.model.js";
import { orderItemRepository } from "../repositories/order-item.repository.js";
import { orderRepository } from "../repositories/order.repository.js";
import { parsePagination } from "../utils/pagination.util.js";
import type { GetOrdersQueryDTO, UpdateOrderDTO, UpdateStatusOrderDTO } from "../validations/order.validation.js";


export const adminOrderService = {
    getAll: async (query: GetOrdersQueryDTO): Promise<GetUserOrdersWithOrderItemsResponse> => {
        const {page, limit, skip} = parsePagination(query)

        const [orders, totalData] = await Promise.all([orderRepository.findAll({limit, offset: skip, status: query.status}), orderRepository.countAll({limit, offset: skip, status: query.status})])
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

    updateById: async (id: number, dto: UpdateOrderDTO): Promise<void> => {
        const order = await orderRepository.findById(id)
        if (!order) throw new NotFoundError("Pesanan tidak ditemukan")

        const result = await orderRepository.updateById(id, dto)
        if (!result) throw new InternalServerError(`Gagal memperbarui pesanan, silahkan coba lagi`)
    },

    updateStatusById: async (id: number, dto: UpdateStatusOrderDTO): Promise<void> => {
        const order = await orderRepository.findById(id)
        if (!order) throw new NotFoundError("Pesanan tidak ditemukan")

        if (order.status === dto.status) throw new BadRequestError(`Status pesanan ${ORDER_STATUS_LABEL[order.status]}, tidak perlu diperbarui`)
        if (order.status === ORDER_STATUS.PAID) throw new BadRequestError("Status pesanan sudah selesai tidak dapat di perbarui")
        if (order.status === ORDER_STATUS.CANCELLED) throw new BadRequestError("Status pesanan sudah dibatalkan tidak dapat diperbarui")
        
        const result = await orderRepository.updateById(id, dto)
        if (!result) throw new InternalServerError("Gagal memperbarui status pesanan, silahkan coba lagi")
    }
}