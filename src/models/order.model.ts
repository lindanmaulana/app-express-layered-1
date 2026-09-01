import type { OrderStatus } from "../constants/order-status.constant.js"
import type { PaginationMeta, PaginationQuery } from "../types/api.type.js"
import type { OrderItem } from "./order_item.model.js"

export type Order = {
    id: number
    user_id: number
    total_amount: number
    status: OrderStatus
    idempotency_key: string
    created_at: Date
    updated_at: Date
}

export type OrderResponse = Order
export type OrderResponseWithItems = Order & {
    items: OrderItem[]
}

// Pagination Filter
export type GetOrdersQueryData = PaginationQuery & {
    status?: OrderStatus | undefined
}
export type OrderFilterParams = Omit<GetOrdersQueryData, "page"> & { offset?: number }


// GET with order items
export type OrderWithOrderItems = {
    order: Order & {
        order_items: OrderItem[]
    },
}

export type GetUserOrdersWithOrderItemsResponse = {
    data: OrderWithOrderItems[]
    meta: PaginationMeta
}

export type CreateOrderData = Pick<Order, "user_id" | "total_amount" | "idempotency_key">
export type ValidOrderItem = {
    product_id: number
    quantity: number
    product_price: number
}

type UpdateOrder = Partial<Pick<Order,  "total_amount" | "status">>
export type UpdateOrderData = {
    [K in keyof UpdateOrder]: Order[K] | undefined
}

export type UpdateStatusOrderData = Pick<Order, "status">