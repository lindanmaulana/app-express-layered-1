import type { OrderStatus } from "../constants/order-status.constant.js"
import type { PaginationMeta, PaginationQuery } from "../types/api.type.js"
import type { OrderItem } from "./order_item.model.js"

export type Order = {
    id: number
    user_id: number
    total_amount: number
    status: OrderStatus
    created_at: Date
    updated_at: Date
}

export type OrderResponse = Order



// Pagination Filter
export type GetOrdersQueryData = PaginationQuery & {
    status?: OrderStatus | undefined
}
export type OrderFilterParams = Omit<GetOrdersQueryData, "page"> & { offset?: number }




export type OrderWithOrderItems = {
    order: Order & {
        order_items: OrderItem[]
    },
}

export type GetUserOrdersWithOrderItemsResponse = {
    data: OrderWithOrderItems[]
    meta: PaginationMeta
}

export type CreateOrderData = Pick<Order, "user_id" | "total_amount">


type UpdateOrder = Partial<Pick<Order,  "total_amount" | "status">>
export type UpdateOrderData = {
    [K in keyof UpdateOrder]: Order[K] | undefined
}

export type UpdateStatusOrderData = Pick<Order, "status">