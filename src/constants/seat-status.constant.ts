export const SEAT_STATUS = {
    available: 'AVAILABLE',
    booked: 'BOOKED'
} as const

export type SeatStatus = (typeof SEAT_STATUS) [keyof typeof SEAT_STATUS]
export const SEAT_STATUS_VALUES = Object.values(SEAT_STATUS) as [SeatStatus, ...SeatStatus[]]