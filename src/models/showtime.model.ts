import type { PaginationMeta, PaginationQuery } from "../types/api.type.js"

export interface Showtime {
    id: number
    movie_title: string
    studio_name: string
    broadcast_time: string
    created_at: string
    updated_at: string
}





export type GetShowtimesQueryData = PaginationQuery & {
    search?: string | undefined
    date?: string | undefined
    startDate?: string | undefined
    endDate?: string | undefined
}
export type ShowtimeFilterParams = Omit<GetShowtimesQueryData, "page"> & { offset?: number }

export type CreateShowtimeData = Pick<Showtime, "movie_title" | "studio_name" | "broadcast_time">

export type UpdateShotimeData = {
    [K in keyof CreateShowtimeData]: Showtime[K] | undefined
}





export type ShowtimeResponse = Showtime
export type paginatedShowtimesResult = {
    data: Showtime[]
    meta: PaginationMeta
}