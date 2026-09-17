import type { SeatStatus } from "../constants/seat-status.constant.js"

export interface Seat {
    id: number
    showtime_id: number
    seat_number: string
    status: SeatStatus
    created_at: string
    updated_at: string
}






export type CreateSeatData = Pick<Seat, "showtime_id" | "seat_number">
export type UpdateSeatData = {
    seat_number?: string | undefined
    status?: SeatStatus | undefined
}






export interface SeatResponse extends Seat {}