export type OrderItem = {
    id: number
    order_id: number
    product_id: number
    quantity: number
    price_at_purchase: number
    created_at: Date
    updated_at: Date
}


export type OrderItemRespoonse = OrderItem

export type CreateOrderItemData = Pick<OrderItem, "order_id" | "product_id" | "quantity" | "price_at_purchase">