export const ORDER_STATUS = {
    PENDING: 'PENDING',
    PAID: 'PAID',
    CANCELLED: 'CANCELLED'
} as const

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
    [ORDER_STATUS.PENDING]: "Menunggu pembayaran",
    [ORDER_STATUS.PAID]: "Selesai (Dibayar)",
    [ORDER_STATUS.CANCELLED]: "Dibatalkan"
}

export type OrderStatus = (typeof ORDER_STATUS) [keyof typeof ORDER_STATUS]
export const ORDER_STATUS_VALUES = Object.values(ORDER_STATUS) as [OrderStatus, ...OrderStatus[]]
